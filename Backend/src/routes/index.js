const userRoute = require("./user");
const postRoute = require("./post");

function route(app) {
  const version = "v1";

  app.use(`/${version}/users`, userRoute);
  
  app.use(`/${version}/post`, postRoute);
}

module.exports = route;
