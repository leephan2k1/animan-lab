const userRoute = require("./user");

function route(app) {
  const version = "v1";

  app.use(`/${version}/users`, userRoute);
}

module.exports = route;
