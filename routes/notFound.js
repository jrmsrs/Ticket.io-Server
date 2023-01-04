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
      process.env.HOST+ "/user",
      process.env.HOST+ "/group",
      process.env.HOST+ "/issue",
      process.env.HOST+ "/lero",
      process.env.HOST+ "/report",
    ],
  });
});

module.exports = router;
