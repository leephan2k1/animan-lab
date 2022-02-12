const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({ users });
  },

  signUp: async (req, res, next) => {
    console.log(req.verified.body);
    const { first_name, last_name, email, password } = req.verified.body;
    //check email was registered
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(401)
        .json({ success: false, message: "email is already registered" });
    }
    //create user & save user to db
    const newUser = new User({ first_name, last_name, email, password });
    await newUser.save();

    return res.status(201).json({ success: true });
  },
};
