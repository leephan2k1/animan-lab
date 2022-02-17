const router = require("express-promise-router")();
const CommentController = require("../controllers/comment");
const { verifyAccessToken } = require("../helper/jwtService");
const { validateBody, schemas } = require("../helper/validateRouter");

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
  verifyAccessToken,
  CommentController.deleteComment
);

module.exports = router;
