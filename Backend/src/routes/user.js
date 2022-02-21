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
/v1/users/:user-name
*/
router
  .route("/:user_name")
  .get(
    validateParams(schemas.userNameSchema, "user_name"),
    UserController.getInfo
  );

/*
/v1/users/:user_name/bookmark
*/
router
  .route("/:user_name/bookmark")
  .get(verifyAccessToken, UserController.getBookmark)
  .post(
    validateBody(schemas.objectIdRequiredSchema),
    verifyAccessToken,
    UserController.addBookmark
  )
  .delete(
    validateBody(schemas.objectIdRequiredSchema),
    verifyAccessToken,
    UserController.removeBookmark
  );

/*
/v1/users/sign-up
*/
router
  .route("/sign-up")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

/*
/v1/users/sign_in
*/
router
  .route("/sign-in")
  .post(
    validateBody(schemas.loginSchema),
    passport.authenticate("local", { session: false }),
    UserController.signIn
  );

/*
/v1/users/sign-out
*/
router.route("/sign-out").delete(UserController.signOut);

/*
/v1/users/refresh-token
*/
router.route("/refresh-token").post(UserController.refreshToken);

module.exports = router;
