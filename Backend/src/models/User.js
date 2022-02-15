const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    first_name: { type: String, min: 1, max: 20 },
    last_name: { type: String, min: 1, max: 20 },
    about: { type: String, min: 1, max: 50 },
    birthday: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true, index: true},
    password: { type: String, required: true, min: 6 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    can_post: {type: Boolean, default: true},
    bookmark_posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    can_comment: {type: Boolean, default: true},
    avatar: { type: Schema.Types.ObjectId, ref: "Image" },
    favorite_list: [{ type: Schema.Types.ObjectId, ref: "Animan" }],
    roles: { type: Array, default: ["user"] },
    points: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

//password encoded
User.pre("save", async function (next) {
  try {
    //IMPORTANT: arrow function not working with 'this'! use keyword function.
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(this.password, salt);
    //Store  password hash
    this.password = passwordHashed;
    next();
  } catch (err) {
    next(err);
  }
});

//password verify
User.methods.verifyPassword = async function (reqPassword) {
  try {
    return await bcrypt.compare(reqPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model("User", User);
