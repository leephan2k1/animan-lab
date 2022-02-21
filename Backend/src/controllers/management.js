const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  getPost: async (req, res, next) => {
    const posts = await Post.find({ approve: false });
    return res.status(200).json({ success: true, posts });
  },
};
