const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/jwt");
const createError = require("http-errors");
const User = require("../models/User")

const signAccessToken = (userId) => {
  return jwt.sign(
    {
      iss: "admin",
      sub: userId,
    },
    JWT_SECRET,
    {
      expiresIn: "6h",
    }
  );
};

const signRefreshToken = (userId) => {
  return jwt.sign(
    {
      iss: "admin",
      sub: userId,
    },
    JWT_SECRET,
    {
      expiresIn: "1y",
    }
  );
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if(err){
      return next(createError.Unauthorized());
    }
    const user = await User.findById(payload.sub);
    if (!user){
      return next(createError.Unauthorized())
    }
    // not errors
    req.payload = payload;
    next();
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
};
