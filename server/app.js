const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const router = require("./router");
const passport = require("./passport");
const dbConnection = require("./database/db_connection");

const app = express();

// read the config file
// eslint-disable-next-line global-require
require("env2")("./.env");

// connect with DB
dbConnection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  // serve any static files
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Handle React routing, resturn all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  // read the config file
  // eslint-disable-next-line global-require
  require("env2")("./.env");
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// use passport config middleware
app.use(passport().initialize());

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // render the error page
  console.log(err, "SECOND ERROR ______________");

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
