const Post = require("../models/Post");

module.exports = {
  filters: async (req, res, next) => {
    const filters = req.query;
    const { title, tags } = filters;

    if (title) {
      const posts = await Post.find(
        {
          title: { $regex: title, $options: "i" },
        },
        { __v: 0 }
      );
      return res.status(200).json({ success: true, posts });
    }

    if (tags) {
      const posts = await Post.find(
        {
          tags: { $in: [tags] },
        },
        { __v: 0 }
      );
      return res.status(200).json({ success: true, posts });
    }

    return res.status(404).json({ success: false, message: "Not found" });
  },
};
