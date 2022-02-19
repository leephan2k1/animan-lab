const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helper/jwtService");
const ManagementController = require("../controllers/management");

/*
/v1/managements/get-post (approve: false)
roles: admin || mod
*/
router.route("/get-post").get(verifyAccessToken, ManagementController.getPost);

module.exports = router;
