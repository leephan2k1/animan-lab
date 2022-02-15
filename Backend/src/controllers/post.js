const Post = require("../models/Post");
const urlSlug = require("url-slug");

module.exports = {
  createPost: async (req, res, next) => {
    const { sub } = req.payload; // -> userId
    const postPayload = req.verified.body;
    const { title, content } = postPayload;

    //check exist post title
    const duplicatedTitle = await Post.findOne({ title });
    if (duplicatedTitle) {
      return res.status(401).json({
        success: false,
        message: "Duplicated title",
      });
    }

    //generator slug
    const slug = urlSlug(title);

    const post = new Post({
      title,
      content,
      author: sub,
      images_url: postPayload?.images_url || [],
      tags: postPayload?.tags || [],
      slug,
    });

    await post.save();

    res.status(201).json({
      success: true,
      post: postPayload,
    });
  },

};
