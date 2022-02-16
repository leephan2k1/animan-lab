const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    author_name: { type: String, required: true, min: 2 },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    content: { type: String, required: true, min: 3 },
    banned: { type: Boolean, default: false },
    flag: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", Comment);
