const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");
const passport = require("passport");
require("../middlewares/passport");
const { verifyAccessToken } = require("../helper/jwtService");

/*
/v1/users
*/
router.get("/", verifyAccessToken, UserController.index); //-> get all users [TEST ACCESS TOKEN]

/*
/v1/users/sign_up
*/
router
  .route("/sign_up")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

/*
/v1/users/sign_in
*/
router
  .route("/sign_in")
  .post(
    validateBody(schemas.loginSchema),
    passport.authenticate("local", { session: false }),
    UserController.signIn
  );

/*
/v1/users/refresh-token
*/
router
  .route("/refresh-token")
  .post(UserController.refreshToken);

module.exports = router;
