const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const urlSlug = require("url-slug");
const { existChecker, nonExistChecker } = require("../helper/existChecker");

module.exports = {
  index: async (req, res, next) => {
    const posts = await Post.find({ approve: true }, { __v: 0 });
    return res.status(200).json({ success: true, posts });
  },

  getPost: async (req, res, next) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }, { __v: 0 }).populate("comments");
    if (!post || !post.approve) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found or not approved" });
    }

    //up view for post
    let { view } = post;
    view++;
    await post.updateOne({ view });

    return res.status(200).json({ success: true, post });
  },

  createPost: async (req, res, next) => {
    const { sub } = req.payload; // -> userId (access token return)
    const owner = await User.findById(sub);
    const postPayload = req.verified.body;
    const { title, content, plainText } = postPayload;

    //check exist post title
    const duplicatedTitle = await Post.findOne({ title });
    existChecker(duplicatedTitle, "Duplicated title", res);

    //check user has been banned:
    nonExistChecker(owner.can_post, "User has been banned", res);

    //generator slug
    const slug = urlSlug(title);

    //get name author
    const { user_name } = owner;

    //check admin owner post -> [true] approve post = true
    let isAdmin = false;
    if (owner.roles.find((role) => role === "admin")) {
      isAdmin = true;
    }

    const post = new Post({
      approve: isAdmin,
      title,
      content,
      plainText,
      author_id: sub,
      author_name: user_name,
      images_url: postPayload?.images_url || [],
      tags: postPayload?.tags || [],
      slug,
    });

    await post.save();
    owner.posts.push(post._id);
    await owner.save();

    return res.status(201).json({
      success: true,
      post: postPayload,
      slug,
    });
  },

  updatePost: async (req, res, next) => {
    const { sub } = req.payload; // (userId Access token)
    const { slug } = req.params;
    const payload = req.verified.body;

    const postOwner = await User.findById(sub);
    const post = await Post.findOne({ slug });

    nonExistChecker(post, "post not found", res);

    //check user has been banned:
    nonExistChecker(postOwner.can_post, "User has been banned", res);

    //check post owner or check the user's permission to be able to modify the post
    if (
      postOwner._id.toString() !== post.author_id.toString() ||
      !postOwner.can_post
    ) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorization",
      });
    }

    //check title if exist:
    if (payload.title) {
      //check exist post title
      const duplicatedTitle = await Post.findOne({ title: payload.title });
      existChecker(duplicatedTitle, "Duplicated title", res);
      //save new title
      post.title = payload.title;
      //save new slug
      post.slug = urlSlug(payload.title);
    }

    //check content if exist:
    if (payload.content) {
      post.content = payload.content;
    }

    await post.save();

    return res.status(200).json({ success: true, post });
  },

  deletePost: async (req, res, next) => {
    //check admin or owner post
    const { sub } = req.payload; // -> userId (access token return)
    const { slug } = req.verified.body;
    const user = await User.findById(sub);
    const post = await Post.findOne({ slug });

    nonExistChecker(post, "post not found", res);

    //check admin -> [true] delete by admin
    if (user.roles.find((role) => role === "admin")) {
      // delete comment in collection Comments & comments in user

      //pull all comments
      const commentsId = await Comment.find({ post: post._id }, "_id");
      await User.updateMany(
        { comments: { $in: commentsId } },
        { $pullAll: { comments: commentsId } }
      );
      // pull all list like post
      await User.updateMany(
        { like_list: { $in: [post._id] } },
        { $pull: { like_list: { $in: [post._id] } } }
      );
      // pull all list bookmark post
      await User.updateMany(
        { bookmark_posts: { $in: [post._id] } },
        { $pull: { bookmark_posts: { $in: [post._id] } } }
      );

      await Comment.deleteMany({ post: post._id });
      await Report.deleteMany({ post_id: post._id });
      await post.remove();

      // pull post Array in collection User
      const ownerPost = await User.findById(post.author_id);
      if (ownerPost) {
        await ownerPost.posts.pull(post);
        await ownerPost.save();

        //delete by admin -> -10 points
        let { points } = ownerPost;
        points -= 10;
        await ownerPost.update({ points });
      }

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the admin",
      });
    }
    //check owner -> [true] delete by owner
    else if (post.author_id.toString() === sub) {
      // delete comment in collection Comments & comments in user
      const commentsId = await Comment.find({ post: post._id }, "_id");
      await User.updateMany(
        { comments: { $in: commentsId } },
        { $pullAll: { comments: commentsId } }
      );
      // pull all list like post
      await User.updateMany(
        { like_list: { $in: [post._id] } },
        { $pull: { like_list: { $in: [post._id] } } }
      );
      // pull all list bookmark post
      await User.updateMany(
        { bookmark_posts: { $in: [post._id] } },
        { $pull: { bookmark_posts: { $in: [post._id] } } }
      );
      await Comment.deleteMany({ post: post._id });
      await Report.deleteMany({ post_id: post._id });
      await post.remove();
      // pull post Array in collection User
      await user.posts.pull(post);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the owner",
      });
    }

    //not owner, not admin -> not permission!
    res.status(401).json({ success: false, message: "Unauthorized" });
  },

  report: async (req, res, next) => {
    const reportObj = req.verified.body;
    const { post_id } = reportObj;

    const report = new Report(reportObj);
    await report.save();

    const post = await Post.findById(post_id);
    nonExistChecker(post, "Post not found", res);

    let { report_list } = post;
    if (!report_list.includes(report._id.toString())) {
      report_list.push(report._id);
      await post.updateOne({ report_list, is_flag: true });
    }

    return res.status(200).json({ success: true });
  },
};
