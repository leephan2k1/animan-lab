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
router.get("/", CommentController.index);

/*
/v1/comments/create-comment
*/
router.post(
  "/create-comment",
  validateBody(schemas.commentSchema),
  verifyAccessToken,
  CommentController.createComment
);

/*
/v1/comments/delete-comment/:id
*/
router.delete(
  "/delete-comment/:id",
  validateParams(schemas.idCommentSchema, "id"),
  verifyAccessToken,
  CommentController.deleteComment
);

/*
/v1/comments/update-comment/:id
*/
router.patch(
  "/update-comment/:id",
  validateParams(schemas.idCommentSchema, "id"),
  validateBody(schemas.updateCommentSchema),
  verifyAccessToken,
  CommentController.updateComment
);

module.exports = router;
