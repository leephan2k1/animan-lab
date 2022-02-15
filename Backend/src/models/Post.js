const mongoose = require("mongoose");
const { Schema } = mongoose;

const Post = new Schema(
  {
    approve: { type: Boolean, default: false },
    is_flag: { type: Boolean, default: false },
    title: { type: String, required: true, min: 3, unique: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true, min: 10 },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author_name: {type: String, min: 1},
    images_url: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    can_edit: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", Post);
