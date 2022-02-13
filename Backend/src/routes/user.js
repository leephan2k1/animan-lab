const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");
const passport = require("passport");
require("../middlewares/passport");

/*
/v1/users
*/
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  UserController.index
); //-> get all users [TEST ACCESS TOKEN]

/*
/v1/users/signup
*/
router
  .route("/signup")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

/*
/v1/users/login
*/
router
  .route("/login")
  .post(
    validateBody(schemas.loginSchema),
    passport.authenticate("local", { session: false }),
    UserController.login
  );

module.exports = router;
