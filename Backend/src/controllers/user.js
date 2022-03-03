const User = require("../models/User");
const Post = require("../models/Post");
const MyLove = require("../models/MyLove");
const RefreshToken = require("../models/Token");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helper/jwtService");
const createError = require("http-errors");

module.exports = {
  signUp: async (req, res, next) => {
    const { first_name, last_name, user_name, email, password } =
      req.verified.body;
    //check email was registered
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(401)
        .json({ success: false, message: "email is already registered" });
    }
    //check user_name was registered
    const existUserName = await User.findOne({ user_name });
    if (existUserName) {
      return res
        .status(401)
        .json({ success: false, message: "user name already exists" });
    }

    //create user & save user to db
    const newUser = new User({
      first_name,
      last_name,
      user_name,
      email,
      password,
    });
    await newUser.save();

    const token = await signAccessToken(newUser._id);
    const refreshToken = await signRefreshToken(newUser._id);

    res.setHeader("Authorization", token);
    res.setHeader("RefreshToken", refreshToken);

    return res.status(201).json({ success: true, user: { user_name } });
  },

  signIn: async (req, res, next) => {
    const { user } = req;
    const token = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    res.setHeader("Authorization", token);
    res.setHeader("RefreshToken", refreshToken);

    res.json({
      success: true,
      user: { avatar: user.avatar, user_name: user.user_name },
    });
  },

  getInfo: async (req, res, next) => {
    const { user_name } = req.verified.params;
    const user = await User.findOne({ user_name }, { __v: 0, password: 0 });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  },

  signOut: async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const { sub } = await verifyRefreshToken(refreshToken);
    const refreshTokenOdd = await RefreshToken.findOne({ userId: sub });
    await refreshTokenOdd.remove();
    res.status(200).json({
      success: true,
    });
  },

  refreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();

    const { sub } = await verifyRefreshToken(refreshToken);

    const newToken = await signAccessToken(sub);
    const newRefreshToken = await signRefreshToken(sub);

    res.setHeader("Authorization", newToken);
    res.setHeader("RefreshToken", newRefreshToken);

    res.status(201).json({ success: true });
  },

  addBookmark: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const user = await User.findById(sub);

    const { bookmark_posts } = user;
    if (!bookmark_posts.includes(id.toString())) {
      bookmark_posts.push(id);
    }
    await user.updateOne({ bookmark_posts });
    return res.status(200).json({ success: true });
  },

  getBookmark: async (req, res, next) => {
    const { sub } = req.payload;
    const { user_name } = req.params;

    const user = await User.findById(sub).populate("bookmark_posts", {
      __v: 0,
    });
    if (user_name !== user.user_name) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, bookmark_posts: user.bookmark_posts });
  },

  removeBookmark: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const user = await User.findById(sub);
    let { bookmark_posts } = user;
    if (bookmark_posts.includes(id.toString())) {
      bookmark_posts = bookmark_posts.filter((post) => post.toString() !== id);
      await user.updateOne({ bookmark_posts });
    }
    return res.status(200).json({ success: true });
  },

  getLikedList: async (req, res, next) => {
    const { sub } = req.payload;
    const { user_name } = req.params;
    const user = await User.findById(sub).populate("like_list", { __v: 0 });
    if (user_name !== user.user_name) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, like_list: user.like_list });
  },

  addLikePost: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const post = await Post.findById(id);
    const user = await User.findById(sub);
    let { like_list } = user;
    if (!like_list.includes(id)) {
      like_list.push(id);
      await user.updateOne({ like_list });
      //up like for post
      let { like } = post;
      like++;
      await post.updateOne({ like });

      //up point for author
      const ownerPost = await User.findById(post.author_id);
      if (ownerPost) {
        let { points } = ownerPost;
        points++;
        await ownerPost.updateOne({ points });
      }
    }

    return res.status(200).json({ success: true });
  },

  removeLikePost: async (req, res, next) => {
    const { sub } = req.payload;
    const { id } = req.verified.body;
    const post = await Post.findById(id);
    const user = await User.findById(sub);
    let { like_list } = user;
    if (like_list.includes(id)) {
      like_list = like_list.filter((post) => post.toString() !== id);
      await user.updateOne({ like_list });
      //down like post
      let { like } = post;
      like--;
      await post.updateOne({ like });

      //down point for author
      const ownerPost = await User.findById(post.author_id);
      if (ownerPost) {
        let { points } = ownerPost;
        points--;
        await ownerPost.updateOne({ points });
      }
    }

    return res.status(200).json({ success: true });
  },

  createMyLove: async (req, res, next) => {
    const { sub } = req.payload;
    const { title, type, description, image, tags } = req.body;
    const myLove = new MyLove({
      title,
      type,
      author: sub,
      description: description || "",
      image: image || "",
      tags: tags || [],
    });

    await myLove.save();

    return res.status(200).json({ success: true, myLove });
  },
};
