const Post = require("../models/Post");
const User = require("../models/User");
const urlSlug = require("url-slug");

module.exports = {
  createPost: async (req, res, next) => {
    const { sub } = req.payload; // -> userId (access token return)
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

  deletePost: async (req, res, next) => {
    //check admin or owner post
    const { sub } = req.payload; // -> userId (access token return)
    const { slug } = req.verified.body;
    const user = await User.findById(sub);
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(401).json({
        success: false,
        message: "Not found post!",
      });
    }
    //check admin -> [true] delete by admin
    if (user.roles.find((role) => role === "admin")) {
      await post.remove();
      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the admin",
      });
    }
    //check owner -> [true] delete by owner
    else if (post.author.toString() === sub) {
      await post.remove();
      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the owner",
      });
    }

    //not owner, not admin -> not permission!
    res.status(200).json({ success: false, message: "Unauthorized" });
  },
};
