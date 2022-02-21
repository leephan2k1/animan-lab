const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  getPost: async (req, res, next) => {
    const posts = await Post.find({ approve: false });
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
    res.status(200).json({ success: true});
  },
};
