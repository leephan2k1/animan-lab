const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helper/jwtService");
const ManagementController = require("../controllers/management");
const { checkApprover } = require("../middlewares/permission");

/*
/v1/managements/get-post (approve: false)
roles: admin || mod
*/
router
  .route("/get-post")
  .get(verifyAccessToken, checkApprover, ManagementController.getPost);

module.exports = router;
