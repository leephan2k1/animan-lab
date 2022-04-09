const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const Post = new Schema(
  {
    approve: { type: Boolean, default: false },
    is_flag: { type: Boolean, default: false },
    report_list: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    title: { type: String, required: true, min: 3, unique: true },
    plainText: { type: String, required: true, min: 10 },
    slug: { type: String, unique: true },
    content: { type: String, required: true, min: 10 },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author_name: { type: String, min: 1 },
    images_url: [{ type: String, min: 4 }],
    tags: [{ type: String, min: 2 }],
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    can_edit: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

Post.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", Post);
