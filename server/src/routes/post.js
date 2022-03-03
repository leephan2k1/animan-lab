const router = require("express-promise-router")();
const PostController = require("../controllers/post");
const { validateBody, schemas } = require("../helper/validateRouter");
const { verifyAccessToken } = require("../helper/jwtService");

/*
/v1/posts
*/
router.route("/").get(PostController.index);

/*
/v1/posts/create-post
*/
router
  .route("/create-post")
  .post(
    validateBody(schemas.postSchema),
    verifyAccessToken,
    PostController.createPost
  );
/*
/v1/posts/delete-post
*/
router
  .route("/delete-post")
  .delete(
    validateBody(schemas.deletePostSchema),
    verifyAccessToken,
    PostController.deletePost
  );

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
