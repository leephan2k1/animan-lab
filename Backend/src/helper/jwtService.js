const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/jwt");

const signAccessToken = (userId) => {
  return jwt.sign(
    {
      iss: "admin",
      sub: userId,
      iat: new Date().getTime(),
      exp: new Date().setTime(21600000), //6 hours
    },
    JWT_SECRET,
    {
      expiresIn: "6h",
    }
  );
};

module.exports = signAccessToken;
