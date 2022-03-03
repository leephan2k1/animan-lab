const userRoute = require("./user");
const postRoute = require("./post");
const commentRoute = require("./comment");
const managementRoute = require("./management");
const SearchController = require("../controllers/search");

function route(app) {
  const version = "v1";

  app.use(`/${version}/users`, userRoute);

  app.use(`/${version}/posts`, postRoute);

  app.use(`/${version}/comments`, commentRoute);

  app.use(`/${version}/managements`, managementRoute);

  app.use(`/${version}/search`, SearchController.filters);
}

module.exports = route;
