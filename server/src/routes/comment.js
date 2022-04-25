const router = require("express-promise-router")();
const CommentController = require("../controllers/comment");
const { verifyAccessToken } = require("../helper/jwtService");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");

/*
/v1/comments
*/
router
  .route("/")
  .get(CommentController.index)
  .post(validateBody(schemas.reportSchema), CommentController.reportComment);

/*
/v1/comments/like
*/
router.post(
  "/like",
  validateBody(schemas.objectIdRequiredSchema),
  verifyAccessToken,
  CommentController.likeComment
);

/*
/v1/comments/unlike
*/
router.post(
  "/unlike",
  validateBody(schemas.objectIdRequiredSchema),
  verifyAccessToken,
  CommentController.unlikeComment
);

/*
/v1/comments/comment/:id
*/
router
  .route("/comment")
  .post(
    validateBody(schemas.commentSchema),
    verifyAccessToken,
    CommentController.createComment
  );
/*
/v1/comments/delete-comment/:id
*/
router
  .route("/comment/:id")
  .delete(
    validateParams(schemas.objectIdSchema, "id"),
    verifyAccessToken,
    CommentController.deleteComment
  )
  .patch(
    validateParams(schemas.objectIdSchema, "id"),
    validateBody(schemas.updateCommentSchema),
    verifyAccessToken,
    CommentController.updateComment
  );

module.exports = router;
