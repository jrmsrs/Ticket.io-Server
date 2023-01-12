const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const crypto = require("node:crypto");

router.post("/", (req, res, next) => {
  const solution = {
    uuid: crypto.randomUUID(),
    title: req.body.title,
    details: req.body.details,
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "INSERT INTO solution (id, title, details) VALUES (?,?,?);",
      [
        solution.uuid,
        solution.title,
        solution.details,
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
          message: "solution inserido",
          id: solution.uuid,
        });
      }
    );
  });
});

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query("SELECT * FROM `solution`;", (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      return res.status(200).send({
        message: "listar solutions",
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
      "SELECT * FROM `solution` WHERE id = ?;",
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
          message: "dados da solution",
          results: result[0],
        });
      }
    );
  });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const solution = {
    title: req.body.title,
    details: req.body.details,
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    let sqlQuery = `UPDATE solution SET`;
    Object.entries(solution).forEach(([key, value]) => {
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
        message: "solution com ID=" + id + " alterado com sucesso.",
      });
    });
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "DELETE FROM `solution` WHERE id = ?;", id,
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
            message: "solution com ID=" + id + " removido com sucesso.",
          });
        else
          return res.status(204).send({
            message: "solution com ID=" + id + " não existe.",
          });
      }
    );
  });
});

module.exports = router;
