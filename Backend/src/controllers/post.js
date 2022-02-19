const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const urlSlug = require("url-slug");

module.exports = {
  index: async (req, res, next) => {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, posts });
  },

  getPost: async (req, res, next) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }, { __v: 0 }).populate("comments");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }

    return res.status(200).json({ success: true, post });
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
    if (owner.roles.find((role) => role === "admin")) {
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
      slug,
    });
  },

  updatePost: async (req, res, next) => {
    const { sub } = req.payload; // (userId Access token)
    const { slug } = req.params;
    const payload = req.verified.body;

    const postOwner = await User.findById(sub);
    const post = await Post.findOne({ slug });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }

    //check post owner or check the user's permission to be able to modify the post
    if (
      postOwner._id.toString() !== post.author_id.toString() ||
      !postOwner.can_post
    ) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorization",
      });
    }

    //check title if exist:
    if (payload.title) {
      //check exist post title
      const duplicatedTitle = await Post.findOne({ title: payload.title });
      if (duplicatedTitle) {
        return res.status(401).json({
          success: false,
          message: "Duplicated title",
        });
      }
      //save new title
      post.title = payload.title;
      //save new slug
      post.slug = urlSlug(payload.title);
    }

    //check content if exist:
    if (payload.content) {
      post.content = payload.content;
    }

    await post.save();

    return res.status(200).json({ success: true, post });
  },

  deletePost: async (req, res, next) => {
    //check admin or owner post
    const { sub } = req.payload; // -> userId (access token return)
    const { slug } = req.verified.body;
    const user = await User.findById(sub);
    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }
    //check admin -> [true] delete by admin
    if (user.roles.find((role) => role === "admin")) {
      // delete comment in collection Comments & comments in user
      const commentsId = await Comment.find({ post: post._id }, "_id");
      await User.updateMany(
        { comments: { $in: commentsId } },
        { $pullAll: { comments: commentsId } }
      );
      await Comment.deleteMany({ post: post._id });
      await post.remove();

      // pull post Array in collection User
      const ownerPost = await User.findById(post.author_id);
      if (ownerPost) {
        await ownerPost.posts.pull(post);
        await ownerPost.save();
      }

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the admin",
      });
    }
    //check owner -> [true] delete by owner
    else if (post.author_id.toString() === sub) {
      // delete comment in collection Comments & comments in user
      const commentsId = await Comment.find({ post: post._id }, "_id");
      await User.updateMany(
        { comments: { $in: commentsId } },
        { $pullAll: { comments: commentsId } }
      );
      await Comment.deleteMany({ post: post._id });
      await post.remove();
      // pull post Array in collection User
      await user.posts.pull(post);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "The post has been deleted by the owner",
      });
    }

    //not owner, not admin -> not permission!
    res.status(401).json({ success: false, message: "Unauthorized" });
  },
};
