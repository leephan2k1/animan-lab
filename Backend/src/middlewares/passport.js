const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { JWT_SECRET } = require("../configs/jwt");
const User = require("../models/User");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
  secretOrKey: JWT_SECRET,
};
passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (!user) return done(null, false);

      done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);
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
