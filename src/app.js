const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const fileupload = require("express-fileupload");

const routeUser = require("./routes/user");
const routeGroup = require("./routes/group");
const routeIssue = require("./routes/issue");
const routeSolution = require("./routes/solution");
const routeLero = require("./routes/lero");
const routeReport = require("./routes/report");

const routeNotFound = require("./routes/notFound");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

app.use(morgan("dev"));
app.use("/user", routeUser);
app.use("/group", routeGroup);
app.use("/issue", routeIssue);
app.use("/solution", routeSolution);
app.use("/lero", routeLero);
app.use("/report", routeReport);
app.use(routeNotFound);

module.exports = app;
