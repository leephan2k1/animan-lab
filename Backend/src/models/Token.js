const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, expires: 365 * 24 * 60 * 60, default: Date.now },
});

module.exports = mongoose.model("Token", Token);
