const express = require("express");
const router = express.Router();
const { tpLero } = require("lerolero");

router.get("/", (req, res, next) => {
  return res.send(tpLero);
});

module.exports = router;
