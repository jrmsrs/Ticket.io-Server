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
    rotas: ["http://" + req.host + "/user", "http://" + req.host + "/group"],
  });
});

module.exports = router;
