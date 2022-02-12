const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({users});
  },
};
