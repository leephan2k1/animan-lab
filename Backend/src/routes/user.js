const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");
const passport = require("passport");
require("../middlewares/passport");

// /v1/users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  UserController.index
); //-> get all users [TEST]

// /v1/users/signup
router
  .route("/signup")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

module.exports = router;
