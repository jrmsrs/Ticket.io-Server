const express = require("express")
const nodemailer = require('nodemailer')
const axios = require("axios")
const mysql = require("../mysql").pool;
const router = express.Router()

router.get("/", (req, res, next) => {
  const email = req.query.email
  const data = {}
  if (!email) {
    return res.status(400).send({
        response: "Email não informado."
    })
  }

  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    const countQuery = `
      SELECT * FROM \`report\` ORDER BY ID DESC LIMIT 1;
      SELECT count(*) as \`count\` FROM \`user\`;
      SELECT count(*) as \`count\` FROM \`group\`;
      SELECT count(*) as \`count\` FROM \`tp\`;
      SELECT count(*) as \`count\` FROM \`solution\`;
    `
    conn.query(countQuery, (error, result, fields) => {
      conn.release();
      if (error) return res.sendStatus(500);
      data.lastReport = result[0][0]
      data.userCount = result[1][0].count
      data.groupCount = result[2][0].count
      data.issueCount = result[3][0].count
      data.solutionCount = result[4][0].count

      const formatSigned = (exp) => {
        if (exp == 0) return null
        if (exp > 0)
          return "<span style=\"color:green\">(+" + exp + ")</span>"
        else 
          return "<span style=\"color:red\">  ("  + exp + ")</span>"
      }

      const usersAdded = formatSigned(data.userCount - data.lastReport.user_count)
      const groupsAdded = formatSigned(data.groupCount - data.lastReport.group_count)
      const issuesAdded = formatSigned(data.issueCount - data.lastReport.issue_count)
      const solutionsAdded = formatSigned(data.solutionCount - data.lastReport.solution_count)

      const trans = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS
        }
      });
  
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Ticket.io | Relatório Gerencial ${new Date().toLocaleDateString("pt-BR")}`,
        text: 'Contem Relatório Gerencial',
        html: `
          <div style="max-width:600px; margin: auto">
            <img style="width:100%" alt="logo" src="https://raw.githubusercontent.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Client/dev/logo-light.png" />
            <h3>Relatório Gerencial da última semana</h3>
            <hr />
            <h4>Cadastros no Banco de Dados</h4>
            <p>Usuários: ${data.userCount} ${(usersAdded) ? usersAdded : ""}</p>
            <p>Grupos: ${data.groupCount} ${(groupsAdded) ? groupsAdded : ""}</p>
            <p>Tickets de Problemas: ${data.issueCount} ${(issuesAdded) ? issuesAdded : ""}</p>
            <p>Soluções de Causa-Raiz: ${data.solutionCount} ${(solutionsAdded) ? solutionsAdded : ""}</p>
            <h4>Resumo</h4>
            <p>Problemas solucionados: </p>
            <p>Tempo médio de fechamento de problemas: </p>
            <p>Problemas em aberto: </p>
            <p style="padding-bottom: 16px">Problemas em aberto com atraso: </p>
            <pre>Use Ctrl+P para imprimir/salvar o relatório em PDF</pre>
          </div>
        `
      };

      trans.sendMail(mailOptions, (err, info) => {
        if(err)
          return res.status(400).send({
            response: "Ocorreu algum problema no envio para o e-mail " + email + "."
          })
      });

      // Registra 
      axios.post(process.env.HOST+'/report', {
        user_count: data.userCount,
        group_count: data.groupCount,
        issue_count: data.issueCount,
        solution_count: data.solutionCount
      })
      .catch(function (error) {
        return error
      });

      return res.status(200).send({
        response: "Relatório enviado para o e-mail " + email + "."
      })
    });
  })
})

router.post("/", (req, res, next) => {
  const report = {
    user_count: req.body.user_count,
    group_count: req.body.group_count,
    issue_count: req.body.issue_count,
    solution_count: req.body.solution_count,
    solved_issues: 0,
    solving_issues_avg: 0,
    late_issues: 0
  };
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(
      "insert into `report` (`user_count`, `group_count`, `issue_count`, `solution_count`, `solved_issues`, `solving_issues_avg`, `late_issues`) values (?,?,?,?,?,?,?);",
      [
        report.user_count,
        report.group_count,
        report.issue_count,
        report.solution_count,
        report.solved_issues,
        report.solving_issues_avg,
        report.late_issues
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
          message: "report inserido",
          id: result.id,
        });
      }
    );
  });
})

module.exports = router
