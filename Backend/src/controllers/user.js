const User = require("../models/User");
const signAccessToken = require("../helper/jwtService");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({ success: true, users });
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
    const token = signAccessToken(newUser._id);
    res.setHeader("Authorization", token);

    return res.status(201).json({ success: true });
  },

  login: async (req, res, next) => {
    const { user } = req;
    const token = encodedToken(user._id);
    res.setHeader("Authorization", token);

    res.json({ success: true });
  },
};
