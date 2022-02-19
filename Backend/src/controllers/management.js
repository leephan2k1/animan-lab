const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  getPost: async (req, res, next) => {
    const { sub } = req.payload;
    const user = await User.findById(sub);
    const { roles } = user;
    //check roles
    if (roles.includes("admin") || roles.includes("mod")) {
      const posts = await Post.find({ approve: false });
      res.status(200).json({ success: true, posts });
    }

    return res.status(401).json({ success: false, message: "Unauthorized" });
  },
};
