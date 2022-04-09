const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const User = require("./User");
const Post = require("./Post");

const Comment = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    author_name: { type: String, required: true, min: 2 },
    approve: { type: Boolean, default: false },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    content: { type: String, required: true, min: 3 },
    banned: { type: Boolean, default: false },
    flag: { type: Boolean, default: false },
    report_list: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

Comment.pre("remove", async function (next) {
  try {
    const comment = this;
    const user = await User.findById(comment.author_id);
    const post = await Post.findById(comment.post);
    await user.comments.pull(comment);
    await user.save();
    await post.comments.pull(comment);
    await post.save();
  } catch (err) {
    next(err);
  }
});

Comment.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", Comment);
