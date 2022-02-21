const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  getPost: async (req, res, next) => {
    const posts = await Post.find({ approve: false }, { __v: 0 });
    return res.status(200).json({ success: true, posts });
  },

  getFlagPost: async (req, res, next) => {
    const posts = await Post.find({ is_flag: true }, { __v: 0 });
    return res.status(200).json({ success: true, posts });
  },

  approvePost: async (req, res, next) => {
    const { id } = req.verified.body;
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    await post.updateOne({ approve: true });
    res.status(200).json({ success: true });
  },

  banUser: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    await user.updateOne({ can_post: false, can_comment: false });

    res.status(200).json({ success: true });
  },

  unbanUser: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    await user.updateOne({ can_post: true, can_comment: true });

    res.status(200).json({ success: true });
  },
};
