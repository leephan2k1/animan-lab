const router = require("express-promise-router")();
const PostController = require("../controllers/post");
const { validateBody, schemas } = require("../helper/validateRouter");
const { verifyAccessToken } = require("../helper/jwtService");

/*
/v1/posts
*/
router
  .route("/")
  .get(PostController.index)
  .post(
    validateBody(schemas.postSchema),
    verifyAccessToken,
    PostController.createPost
  )
  .delete(
    validateBody(schemas.deletePostSchema),
    verifyAccessToken,
    PostController.deletePost
  );

/*
/v1/posts/private-post
*/
router
  .route("/private-post/:slug")
  .get(verifyAccessToken, PostController.getPrivatePost);

/*
/v1/posts/:slug
*/
router
  .route("/:slug")
  .get(PostController.getPost)
  .post(validateBody(schemas.reportSchema), PostController.report)
  .patch(
    validateBody(schemas.updatePostSchema),
    verifyAccessToken,
    PostController.updatePost
  );

module.exports = router;
