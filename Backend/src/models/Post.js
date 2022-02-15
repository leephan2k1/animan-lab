const mongoose = require("mongoose");
const { Schema } = mongoose;

const Post = new Schema(
  {
    approve: { type: Boolean, default: false },
    is_flag: { type: Boolean, default: false },
    title: { type: String, required: true, min: 3 },
    content: { type: String, required: true, min: 10 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images_url: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    can_edit: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    slug: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", Post);
