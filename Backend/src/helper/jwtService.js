const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/jwt");

const encodedToken = (userId) => {
  return jwt.sign(
    {
      iss: "admin",
      sub: userId,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1), //1 days
    },
    JWT_SECRET
  );
};

module.exports = encodedToken;
