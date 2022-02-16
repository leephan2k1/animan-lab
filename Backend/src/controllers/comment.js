const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  index: async (req, res, next) => {
    const comments = await Comment.find({});
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
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Slug not match any post",
      });
    }

    const comment = new Comment({
      author_id: user._id,
      author_name: user.user_name,
      post: post._id,
      content,
    });

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
};
