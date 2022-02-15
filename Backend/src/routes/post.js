const router = require("express-promise-router")();
const PostController = require("../controllers/post");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");
const { verifyAccessToken } = require("../helper/jwtService");

/*
/v1/post/create-post
*/
router
  .route("/create-post")
  .post(
    validateBody(schemas.postSchema),
    verifyAccessToken,
    PostController.createPost
  );

/*
/v1/post/create-post
*/
// router
//   .route("/delete-post")
//   .delete(
//     verifyAccessToken,
//     PostController.deletePost
//   );

module.exports = router;
