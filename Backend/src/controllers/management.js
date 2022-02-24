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
    const { approve } = post;
    
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (!approve) {
      await post.updateOne({ approve: true });
      const user = await User.findById(post.author_id);
      let { points } = user;
      points += 10;
      await user.updateOne({ points });
    }

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

  appointMod: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    const { roles } = user;

    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    if (!roles.includes("mod")) {
      roles.push("mod");
      await user.updateOne({ roles });
    }

    res.status(200).json({ success: true });
  },

  deposedMod: async (req, res, next) => {
    const { id } = req.verified.body;
    const user = await User.findById(id);
    let { roles } = user;

    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    if (roles.includes("mod")) {
      roles = roles.filter((role) => role !== "mod");
      await user.updateOne({ roles });
    }
    
    res.status(200).json({ success: true });
  },
};
