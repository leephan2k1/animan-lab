const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helper/jwtService");
const ManagementController = require("../controllers/management");
const { checkApprover } = require("../middlewares/permission");
const { validateBody, schemas } = require("../helper/validateRouter");

/*
/v1/managements/get-post (approve: false)
roles: admin || mod
*/
router
  .route("/get-post")
  .get(verifyAccessToken, checkApprover, ManagementController.getPost);

/*
/v1/managements/approve-post (approve: false)
roles: admin || mod
*/
router
  .route("/approve-post")
  .post(
    verifyAccessToken,
    checkApprover,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.approvePost
  );

module.exports = router;
