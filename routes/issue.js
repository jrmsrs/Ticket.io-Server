const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const crypto = require("node:crypto");
const { google } = require('googleapis');
const drive = google.drive('v3');
const fs = require('fs')
const { Readable } =  require('stream')

router.post("/", (req, res, next) => {
  const issue = {
    uuid: crypto.randomUUID(),
    group: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    devContact: req.body.devContact,
    prevConclusion: req.body.prevConclusion,
    incidentsCount: req.body.incidentsCount,
    author: req.body.author
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "INSERT INTO tp (id, group_id, title, `desc`, dev_contact, prev_conclusion, incidents_count, author) VALUES (?,?,?,?,?,?,?,?);",
      [
        issue.uuid,
        issue.group,
        issue.title,
        issue.desc,
        issue.devContact,
        issue.prevConclusion,
        issue.incidentsCount,
        issue.author,
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
          results: result[0],
        });
      }
    );
  });
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const issue = {
    group_id: req.body.group,
    title: req.body.title,
    desc: req.body.desc,
    dev_contact: req.body.devContact,
    prev_conclusion: req.body.prevConclusion,
    conclusion: req.body.conclusion,
    root_cause: req.body.rootCause,
    incidents_count: req.body.incidentsCount,
  };
  if (req.query.upload){
    const upload = async() => {
      try {
        // Authenticate with the Service Account
        const auth = new google.auth.GoogleAuth({
          credentials: JSON.parse(process.env.DRIVEAPI_KEY),
          scopes: ['https://www.googleapis.com/auth/drive']
        });
  
        // Read the file to be uploaded
        const file = req.files.file;
  
        // Create the file metadata
        const fileMetadata = {
          name: file.name,
          parents: [process.env.DRIVEAPI_DIR_ID]
        };
  
        // Upload the file
        const upload = await drive.files.create({
          auth,
          resource: fileMetadata,
          media: {
            body: Readable.from(Buffer.from( file.data, 'base64'))
          }
        });
        console.log(upload.data.id)
        return upload.data.id;
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
        return null;
      }
    }
    
    await upload()
    .then((driveDocId)=>{
      mysql.getConnection((error, conn) => {
        if (error) return res.sendStatus(400);
          return conn.query(`UPDATE tp SET drive_doc_id = '${driveDocId}' WHERE id = '${id}'`, 
          (error, result, fields) => {
            conn.release();
            if (error) {
              return res.status(500).send({
                error: error,
                response: null,
              });
            }
            return res.status(202).send({
              message: "upload efetuado. issue com ID=" + id + " associado ao arquivo id = "+ driveDocId + ".",
            });
          })
      });
    })
    return
  }
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    if (req.query.reincident){
      return conn.query(`
        UPDATE tp 
        SET incidents_count = incidents_count + ${issue.incidents_count}, conclusion = NULL, root_cause = NULL
        WHERE id = '${id}';
      `, 
      (error, result, fields) => {
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
      })
    }

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
