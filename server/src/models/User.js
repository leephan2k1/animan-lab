const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    first_name: { type: String, min: 1, max: 20 },
    last_name: { type: String, min: 1, max: 20 },
    user_name: { type: String, min: 2, max: 10, required: true, unique: true },
    about: { type: String, min: 1, max: 50 },
    birthday: { type: Date },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    gender: { type: String, min: 1 },
    password: { type: String, required: true, min: 6 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    can_post: { type: Boolean, default: true },
    bookmark_posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    like_comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    can_comment: { type: Boolean, default: true },
    avatar: { type: String, min: 4 },
    favorite_list: [{ type: Schema.Types.ObjectId, ref: "Animan" }],
    roles: { type: Array, default: ["user"] },
    points: { type: Number, default: 0 },
    like_list: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    myLove_list: [{ type: Schema.Types.ObjectId, ref: "MyLove" }],
  },
  {
    timestamps: true,
  }
);

//password encoded
User.pre("save", async function (next) {
  try {
    // only hash the password if it has been modified (or is new)
    const user = this;
    if (!user.isModified("password")) return next();

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

User.plugin(mongoosePaginate);

module.exports = mongoose.model("User", User);
