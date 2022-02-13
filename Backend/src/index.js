require("dotenv").config();
const express = require("express");
const app = express();
const port = app.get("port") || 5000;
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const logEvents = require("./helper/logEvents");
const { nanoid } = require("nanoid");
const route = require("./routes");
const db = require("./configs/db");
const createError = require('http-errors')

//connect mongodb
db.connect();

//body-parser middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//enable all CORS requests
app.use(cors());

//security middleware
app.use(helmet());

//logger middleware
app.use(logger("dev"));

//router
route(app);

//catch 404
app.use((req, res, next) => {
  next(createError(404, "404 Not Found!"));
});

//error handler
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  //write message log
  logEvents(
    `id:${nanoid(5)} --- ${req.url} --- ${req.method} --- ${JSON.stringify({
      message: error.message,
    })}`
  );
  return res.status(status).json({
    status,
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
