const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const encodedToken = (userId) => {
  return jwt.sign(
    {
      iss: "admin",
      sub: userId,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3), //3 days
    },
    JWT_SECRET
  );
};

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
    const token = encodedToken(newUser._id);
    res.setHeader("Authorization", token);

    return res.status(201).json({ success: true });
  },
};
