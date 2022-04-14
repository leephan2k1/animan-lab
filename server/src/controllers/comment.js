const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Report = require("../models/Report");
const { existChecker, nonExistChecker } = require("../helper/existChecker");

module.exports = {
  index: async (req, res, next) => {
    const { sort, page, limit, postId } = req.query;

    if (!postId) {
      return res.status(200).json({
        success: false,
        message: "Bad request",
      });
    }

    const conditions = {};
    //default condition:
    conditions.approve = true;
    conditions.post = postId;

    const options = {};
    //default condition:
    options.select = "-__v";
    options.populate = "author_id";

    if (sort) options.sort = { ...options.sort, createdAt: sort };

    if (page) options.page = +page;

    if (limit) options.limit = +limit;

    const comments = await Comment.paginate(conditions, options);

    return res.status(200).json({
      success: true,
      comments,
    });
  },

  createComment: async (req, res, next) => {
    const { sub } = req.payload; //userId parses from access token
    const { content, postSlug } = req.verified.body;
    const user = await User.findById(sub);
    const post = await Post.findOne({ slug: postSlug });

    nonExistChecker(post, "Slug not match any post", res);

    if (!user.can_comment) {
      return res
        .status(401)
        .json({ success: false, message: "User has been banned" });
    }

    const comment = new Comment({
      author_id: user._id,
      author_name: user.user_name,
      post: post._id,
      content,
    });

    //up point when comment
    let { points } = user;
    points++;
    await user.updateOne({ points });

    await comment.save();
    post.comments.push(comment._id);
    user.comments.push(comment._id);
    await post.save();
    await user.save();

    res.status(201).json({
      success: true,
      comment,
    });
  },

  deleteComment: async (req, res, next) => {
    const { sub } = req.payload;
    const commentId = req.verified.params.id;
    const comment = await Comment.findById(commentId);

    nonExistChecker(comment, "comment id is not valid", res);

    const user = await User.findById(sub);

    //check roles
    if (user.roles.find((role) => role === "admin")) {
      await Report.deleteMany({ post_id: comment._id });
      await comment.remove();
      //remove comment in post & user in middleware model Comment
      return res
        .status(200)
        .json({ success: true, message: "comment has been deleted by admin" });
    } else if (user._id.toString() === comment.author_id.toString()) {
      await Report.deleteMany({ post_id: comment._id });
      await comment.remove();

      //remove comment in post & user in middleware model Comment
      return res
        .status(200)
        .json({ success: true, message: "comment has been deleted by owner" });
    }

    return res.status(401).json({ success: false, message: "Unauthorized" });
  },

  updateComment: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.params;

    const comment = await Comment.findById(id).populate("author_id");
    //check owner comment:
    if (comment.author_id._id.toString() !== sub.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    //check can_comment permission:
    if (!comment.author_id.can_comment) {
      return res
        .status(401)
        .json({ success: false, message: "User has been banned" });
    }

    const { content } = req.verified.body;

    await comment.updateOne({ content, approve: false });

    res
      .status(200)
      .json({ success: true, message: "Comment has been updated" });
  },

  likeComment: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const comment = await Comment.findById(id);

    nonExistChecker(comment, "Comment not found", res);

    const user = await User.findById(sub);
    let { like_comments } = user;
    if (!like_comments.includes(id)) {
      like_comments.push(id);
      await user.updateOne({ like_comments });
      let { like } = comment;
      like++;
      await comment.updateOne({ like });
      //up point for owner comment
      if (comment.author_id.toString() !== user._id.toString()) {
        const ownerComment = await User.findById(comment.author_id);
        let { points } = ownerComment;
        points++;
        await ownerComment.updateOne({ points });
      }
    }
    return res.status(200).json({ success: true });
  },

  unlikeComment: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const comment = await Comment.findById(id);
    const user = await User.findById(sub);
    let { like_comments } = user;

    if (like_comments.includes(id)) {
      like_comments = like_comments.filter(
        (likeCmt) => likeCmt.toString() !== id
      );
      await user.updateOne({ like_comments });
      let { like } = comment;
      like--;
      await comment.updateOne({ like });
      //down point for owner comment
      if (comment.author_id.toString() !== user._id.toString()) {
        const ownerComment = await User.findById(comment.author_id);
        let { points } = ownerComment;
        points--;
        await ownerComment.updateOne({ points });
      }
    }
    return res.status(200).json({ success: true });
  },

  reportComment: async (req, res, next) => {
    const reportObj = req.verified.body;
    const { post_id } = reportObj;

    const report = new Report(reportObj);
    await report.save();

    const comment = await Comment.findById(post_id);
    nonExistChecker(comment, "Comment not found", res);

    let { report_list } = comment;
    if (!report_list.includes(report._id.toString())) {
      report_list.push(report._id);
      await comment.updateOne({ report_list, flag: true });
    }

    return res.status(200).json({ success: true });
  },
};
