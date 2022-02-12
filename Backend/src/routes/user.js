const router = require("express-promise-router")();
const UserController = require("../controllers/user");

// /v1/users
router.get("/", UserController.index); //get all users

module.exports = router;