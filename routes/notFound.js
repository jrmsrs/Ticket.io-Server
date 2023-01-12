const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
    rotasPrincipais: [
      req.protocol + "://" + req.headers.host + "/user",
      req.protocol + "://" + req.headers.host + "/group",
      req.protocol + "://" + req.headers.host + "/issue",
      req.protocol + "://" + req.headers.host + "/solution",
      req.protocol + "://" + req.headers.host + "/lero",
      req.protocol + "://" + req.headers.host + "/report",
    ],
  });
});

module.exports = router;
