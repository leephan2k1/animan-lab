const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");

// /v1/users
router.get("/", UserController.index); //get all users

// /v1/users/signup
router
  .route("/signup")
  .post(validateBody(schemas.signUpSchema), UserController.signUp);

module.exports = router;
