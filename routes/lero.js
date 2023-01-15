const express = require("express");
const router = express.Router();
const { lero } = require("lerolero");

router.get("/", (req, res, next) => {
  return res.send({
    issueTitleLero: lero.issueTitleLero(),
    issueDescLero: lero.issueDescLero(),
    solutionTitleLero: lero.solutionTitleLero(),
    solutionDescLero: lero.solutionDescLero(),
    solutionDescLeroPlus: lero.solutionDescLeroPlus(),
  });
});

module.exports = router;
