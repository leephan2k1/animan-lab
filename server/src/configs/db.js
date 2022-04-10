const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/animan-lab");
    console.log("connect success!");
  } catch (e) {
    console.log("connect failed: " + e.message);
  }
}

module.exports = { connect };