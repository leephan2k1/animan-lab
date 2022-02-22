const mongoose = require("mongoose");
const { Schema } = mongoose;

const Report = new Schema(
  {
    author_email: { type: String, required: true },
    author_name: { type: String, min: 2, max: 10, required: true },
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    report_title: { type: String, min: 2, max: 20, required: true },
    report_content: { type: String, min: 3, required: true },
    createdAt: { type: Date, expires: 60 * 60 * 24 * 3, default: Date.now }, // 3 days
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", Report);
