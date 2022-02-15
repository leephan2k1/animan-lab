const userRoute = require("./user");
const postRoute = require("./post");

function route(app) {
  const version = "v1";

  app.use(`/${version}/users`, userRoute);
  
  app.use(`/${version}/posts`, postRoute);
}

module.exports = route;
