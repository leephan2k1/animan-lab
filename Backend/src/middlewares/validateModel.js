const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  checkExistPost_UserName: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const { user_name } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    const user = await User.findById(sub);
    if (user_name !== user.user_name) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return next();
  },
};
