const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const crypto = require("node:crypto");

router.post("/", (req, res, next) => {
  const issue = {
    uuid: crypto.randomUUID(),
    group: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    devContact: req.body.devContact,
    prevConclusion: req.body.prevConclusion,
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "INSERT INTO tp (id, group_id, title, `desc`, dev_contact, prev_conclusion) VALUES (?,?,?,?,?,?);",
      [
        issue.uuid,
        issue.group,
        issue.title,
        issue.desc,
        issue.devContact,
        issue.prevConclusion,
      ],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        return res.status(201).send({
          message: "issue inserido",
          id: issue.uuid,
        });
      }
    );
  });
});

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query("SELECT * FROM `tp`;", (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      return res.status(200).send({
        message: "listar issues",
        results: result,
      });
    });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "SELECT * FROM `tp` WHERE id = ?;",
      id,
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        return res.status(200).send({
          message: "dados da issue",
          results: result,
        });
      }
    );
  });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const issue = {
    group_id: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    dev_contact: req.body.devContact,
    prev_conclusion: req.body.prevConclusion,
    conclusion: req.body.conclusion,
    root_cause: req.body.rootCause,
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    let sqlQuery = `UPDATE tp SET`;
    Object.entries(issue).forEach(([key, value]) => {
      if (value) sqlQuery += ` \`${key}\` = "${value}",`;
    }); // mapeia apenas os campos alterados
    sqlQuery = sqlQuery.slice(0, -1); // remove ultima vírgula
    sqlQuery += ` WHERE id = '${id}';`;
    conn.query(sqlQuery, (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      return res.status(202).send({
        message: "issue com ID=" + id + " alterado com sucesso.",
      });
    });
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "DELETE FROM `tp` WHERE id = ?;", id,
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        if (result.affectedRows > 0)
          return res.status(202).send({
            message: "issue com ID=" + id + " removido com sucesso.",
          });
        else
          return res.status(204).send({
            message: "issue com ID=" + id + " não existe.",
          });
      }
    );
  });
});

module.exports = router;
