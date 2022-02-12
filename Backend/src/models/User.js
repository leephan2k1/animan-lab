const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    first_name: { type: String, min: 1, max: 20 },
    last_name: { type: String, min: 1, max: 20 },
    about: { type: String, min: 1, max: 50 },
    birthday: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, min: 6 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    bookmark_posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    avatar: { type: Schema.Types.ObjectId, ref: "Image" },
    favorite_list: [{ type: Schema.Types.ObjectId, ref: "Animan" }],
    role: { type: String, default: "user" },
    points: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
