const User = require("../models/User");
module.exports = {
  checkApprover: async (req, res, next) => {
    const { sub } = req.payload;
    const user = await User.findById(sub);
    const { roles } = user;
    if (roles.includes("admin") || roles.includes("mod")) {
      return next();
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  },
  isAdmin: async (req, res, next) => {
    const { sub } = req.payload;
    const user = await User.findById(sub);
    const { roles } = user;
    if (roles.includes("admin")) {
      return next();
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  },
};
