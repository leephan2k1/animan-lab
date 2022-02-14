const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { JWT_SECRET } = require("../configs/jwt");
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        //check 2 fields
        //1. check email field
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        //2. check password field
        const isValidPassword = await user.verifyPassword(password);
        //password wrong
        if (!isValidPassword) return done(null, false);
        //password correct: pass to req.user controller
        done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
