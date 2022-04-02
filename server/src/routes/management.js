const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helper/jwtService");
const ManagementController = require("../controllers/management");
const { checkApprover, isAdmin } = require("../middlewares/permission");
const { validateBody, schemas } = require("../helper/validateRouter");

/*
/v1/managements/get-post (approve: false)
roles: admin || mod
*/
router
  .route("/get-post")
  .get(verifyAccessToken, checkApprover, ManagementController.getPost);

/*
/v1/managements/get-comments (approve: false)
roles: admin || mod
*/
router
  .route("/get-comments")
  .get(verifyAccessToken, checkApprover, ManagementController.getComments);

/*
/v1/managements/get-flag-post (is_flag: false)
roles: admin || mod
*/
router
  .route("/get-flag-post")
  .get(verifyAccessToken, checkApprover, ManagementController.getFlagPost);

/*
/v1/managements/get-flag-post (is_flag: false)
roles: admin || mod
*/
router
  .route("/get-flag-comment")
  .get(verifyAccessToken, checkApprover, ManagementController.getFlagComment);

/*
/v1/managements/approve-post
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

/*
/v1/managements/approve-post
roles: admin || mod
*/
router
  .route("/approve-comment")
  .post(
    verifyAccessToken,
    checkApprover,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.approveComment
  );

/*
/v1/managements/ban-user
roles: admin
*/
router
  .route("/ban-user")
  .post(
    verifyAccessToken,
    isAdmin,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.banUser
  );

/*
/v1/managements/unban-user
roles: admin
*/
router
  .route("/unban-user")
  .post(
    verifyAccessToken,
    isAdmin,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.unbanUser
  );

/*
/v1/managements/appoint-user
roles: admin
*/
router
  .route("/appoint-user")
  .post(
    verifyAccessToken,
    isAdmin,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.appointMod
  );
/*
/v1/managements/appoint-user
roles: admin
*/
router
  .route("/deposed-user")
  .post(
    verifyAccessToken,
    isAdmin,
    validateBody(schemas.objectIdRequiredSchema),
    ManagementController.deposedMod
  );

module.exports = router;
