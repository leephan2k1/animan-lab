const userRoute = require("./user");
const postRoute = require("./post");
const commentRoute = require("./comment");

function route(app) {
  const version = "v1";

  app.use(`/${version}/users`, userRoute);
  
  app.use(`/${version}/posts`, postRoute);

  app.use(`/${version}/comments`, commentRoute);
}

module.exports = route;
