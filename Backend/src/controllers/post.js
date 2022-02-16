const Post = require("../models/Post");
const User = require("../models/User");
const urlSlug = require("url-slug");

module.exports = {
  index: async (req, res, next) => {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, posts });
  },

  createPost: async (req, res, next) => {
    const { sub } = req.payload; // -> userId (access token return)
    const owner = await User.findById(sub);
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

    //get name author
    const { user_name } = owner;

    //check admin owner post -> [true] approve post = true
    let isAdmin = false;
    if(owner.roles.find(role => role === 'admin')){
      isAdmin = true;
    }

    const post = new Post({
      approve: isAdmin,
      title,
      content,
      author_id: sub,
      author_name: user_name,
      images_url: postPayload?.images_url || [],
      tags: postPayload?.tags || [],
      slug,
    });

    await post.save();
    owner.posts.push(post._id);
    await owner.save();

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
      //TODO:
      // + delete comment in collection Comments

      // pull post Array in collection User
      const ownerPost = await User.findById(post.author_id);
      if (ownerPost) {
        ownerPost.posts.pull(post);
        await ownerPost.save();
      }

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the admin",
      });
    }
    //check owner -> [true] delete by owner
    else if (post.author_id.toString() === sub) {
      //TODO:
      // + delete comment in collection Comments

      await post.remove();
      // pull post Array in collection User
      user.posts.pull(post);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the owner",
      });
    }

    //not owner, not admin -> not permission!
    res.status(200).json({ success: false, message: "Unauthorized" });
  },
};
