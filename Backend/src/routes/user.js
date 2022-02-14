const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");
const passport = require("passport");
require("../middlewares/passport");
const { verifyAccessToken } = require("../helper/jwtService")

/*
/v1/users
*/
router.get(
  "/",
  verifyAccessToken,
  UserController.index
); //-> get all users [TEST ACCESS TOKEN]

/*
/v1/users/signup
*/
router
  .route("/sign_up")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

/*
/v1/users/login
*/
router
  .route("/sign_in")
  .post(
    validateBody(schemas.loginSchema),
    passport.authenticate("local", { session: false }),
    UserController.login
  );

module.exports = router;
