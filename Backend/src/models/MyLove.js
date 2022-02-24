const mongoose = require("mongoose");
const { Schema } = mongoose;

const MyLove = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    description: {
      type: String,
      min: 5,
    },
    image: {
      type: String,
      min: 5,
    },
    tags: [{ type: String, min: 5 }],
    type: {
      type: String,
      required: true,
      min: 2,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyLove", MyLove);
