const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/jwt");
const createError = require("http-errors");
const User = require("../models/User");
const RefreshToken = require("../models/Token");

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        iss: "admin",
        sub: userId,
      },
      JWT_SECRET,
      {
        expiresIn: "10m",
      },
      (err, payload) => {
        if (err) {
          return reject(err);
        }
        resolve(payload);
      }
    );
  });
};

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        iss: "admin",
        sub: userId,
      },
      JWT_SECRET,
      {
        expiresIn: "1y",
      },
      async (err, payload) => {
        if (err) {
          return reject(err);
        }
        // -> store refresh token to mongodb
        try {
          const existUserToken = await RefreshToken.findOne({ userId });
          if (existUserToken) {
            //exist -> update
            existUserToken.token = payload;
            await existUserToken.save();
          } else {
            //!exist -> create
            const newRefreshToken = new RefreshToken({
              userId,
              token: payload,
            });
            await newRefreshToken.save();
          }
        } catch (error) {
          return reject(createError.InternalServerError());
        }
        resolve(payload);
      }
    );
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return next(createError.Unauthorized());
    }
    // not errors
    req.payload = payload;
    next();
  });
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, JWT_SECRET, async (err, payload) => {
      if (err) {
        return reject(createError.Unauthorized(err.message));
      }
      const { sub } = payload;
      try {
        const existRefreshToken = await RefreshToken.findOne({ userId: sub });
        //valid refresh token (refresh token client = refresh token in db)
        if (existRefreshToken && refreshToken === existRefreshToken.token) {
          resolve(payload);
        }
        if (refreshToken !== existRefreshToken.token) {
          return reject(createError.Unauthorized());
        }
      } catch (error) {
        return reject(createError.InternalServerError());
      }
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
