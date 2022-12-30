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
    rotas: [
      "https://" + req.hostname + "/user",
      "https://" + req.hostname + "/group",
      "https://" + req.hostname + "/issue",
      "https://" + req.hostname + "/lero",
    ],
  });
});

module.exports = router;
