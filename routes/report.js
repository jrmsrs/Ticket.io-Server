const express = require("express")
const nodemailer = require('nodemailer')
const axios = require("axios")
const mysql = require("../mysql").pool;
const router = express.Router()

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  let data = {}
      // SELECT count(*) AS \`res\` FROM \`user\`;
      // SELECT count(*) AS \`res\` FROM \`group\`;
      // SELECT count(*) AS \`res\` FROM \`tp\`;
      // SELECT count(*) AS \`res\` FROM \`solution\`;
      // SELECT count(*) AS \`res\` FROM \`tp\` WHERE \`tp\`.\`root_cause\` IS NULL AND (\`tp\`.prev_conclusion-current_timestamp) < 0;
      // SELECT count(*) AS \`res\` FROM \`tp\` WHERE \`tp\`.\`root_cause\` IS NOT NULL;
      // SELECT avg(timestampdiff(DAY, created_at, conclusion)) AS \`res\` from \`tp\` where \`tp\`.\`conclusion\` is not null;
  const query = `
      SELECT \`group\`.\`id\` as id, \`group\`.\`name\` as name FROM \`group_users\` 
      INNER JOIN \`group\` ON \`group_users\`.\`group_id\` = \`group\`.\`id\`
      WHERE \`group_users\`.\`user_id\` = '${id}';

      SELECT 
        \`user\`.\`id\` as \`user_id\`, 
        \`tp\`.\`id\` as \`tp_id\`, 
        \`group\`.\`id\` as \`group_id\`, 
        \`user\`.\`name\` as \`user_name\`, 
        \`tp\`.\`title\` as \`tp_title\`, 
        \`group\`.\`name\` as \`group_name\`,
        \`tp\`.\`prev_conclusion\` as \`tp_prev_conclusion\`
      FROM \`user\` 
      INNER JOIN \`group_users\` ON \`user\`.\`id\` = \`group_users\`.\`user_id\` 
      INNER JOIN \`group\` ON \`group_users\`.\`group_id\` = \`group\`.\`id\`
      INNER JOIN \`tp\` ON \`group\`.\`id\` = \`tp\`.\`group_id\`
      WHERE \`user\`.\`id\` = '${id}' and \`tp\`.\`conclusion\` is null;

      SELECT * FROM tp WHERE conclusion IS NULL AND author = '${id}';
    `
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(query, async (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      // data.userCount = result[0][0].res
      // data.groupCount = result[1][0].res
      // data.issueCount = result[2][0].res
      // data.solutionCount = result[3][0].res
      // data.issueLateCount = result[4][0].res
      // data.issueFinishedCount = result[5][0].res
      // data.issueConclusionAvg = result[6][0].res
      // data.issueUnfCount = data.issueCount - data.issueFinishedCount
      data.userGroups = result[0]
      data.userOngoingTp = result[1]
      // data.userOngoingTpLate = data.userOngoingTp.filter(el => {
      //   return (new Date(el.tp_prev_conclusion)-new Date()<0);
      // });
      data.userCreatedOngoingTp = result[2]
      
      return res.status(200).send({
        message: "estatisticas",
        result: data,
      });
    });
  });
});

router.get("/", (req, res, next) => {
  const email = req.query.email
  const auto = req.query.auto
  
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
      SELECT * FROM \`report\` WHERE \`id\`=1;
      SELECT count(*) AS \`res\` FROM \`user\`;
      SELECT count(*) AS \`res\` FROM \`group\`;
      SELECT count(*) AS \`res\` FROM \`tp\`;
      SELECT count(*) AS \`res\` FROM \`solution\`;
      SELECT count(*) AS \`res\` FROM \`tp\` WHERE \`tp\`.\`root_cause\` IS NULL AND (\`tp\`.prev_conclusion-current_timestamp) < 0;
      SELECT count(*) AS \`res\` FROM \`tp\` WHERE \`tp\`.\`root_cause\` IS NOT NULL;
      SELECT avg(timestampdiff(DAY, created_at, conclusion)) AS \`res\` from \`tp\` where \`tp\`.\`conclusion\` is not null;
    `
    conn.query(countQuery, async (error, result, fields) => {
      conn.release();
      if (error) return res.sendStatus(500);
      data.lastReport = result[0][0]
      data.cron = result[1][0].cron
      data.userCount = result[2][0].res
      data.groupCount = result[3][0].res
      data.issueCount = result[4][0].res
      data.solutionCount = result[5][0].res
      data.issueLateCount = result[6][0].res
      data.issueFinishedCount = result[7][0].res
      data.issueConclusionAvg = result[8][0].res
      data.issueUnfCount = data.issueCount - data.issueFinishedCount

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
      const issueLateDiff = formatSigned(data.issueLateCount - data.lastReport.late_issues)
      const issueFinishedDiff = formatSigned(data.issueFinishedCount - data.lastReport.solved_issues)
      const issueConclusionDiff = formatSigned(data.issueConclusionAvg - data.lastReport.solving_issues_avg)
      const issueUnfDiff = formatSigned(data.issueUnfCount - (data.lastReport.issue_count - data.lastReport.solved_issues))

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
            <p>Problemas solucionados: ${data.issueFinishedCount} ${(issueFinishedDiff) ? issueFinishedDiff : ""}</p>
            <p>Tempo médio de fechamento de problemas (em dias): ${data.issueConclusionAvg} ${(issueConclusionDiff) ? issueConclusionDiff : ""}</p>
            <p>Problemas em aberto: ${data.issueUnfCount} ${(issueUnfDiff) ? issueUnfDiff : ""}</p>
            <p style="padding-bottom: 16px">Problemas em aberto com atraso: ${data.issueLateCount} ${(issueLateDiff) ? issueLateDiff : ""}</p>
            <pre>Use Ctrl+P para imprimir/salvar o relatório em PDF</pre>
          </div>
        `
      };

      const sendEmail = async() => {
        await trans.sendMail(mailOptions, (err, info) => {
          if(err)
            return res.status(400).send({
              response: "Ocorreu algum problema no envio para o e-mail " + email + "."
            })
        });

        // Registra no banco
        await axios.post(req.protocol + "://" + req.headers.host + '/report', {
          user_count: data.userCount,
          group_count: data.groupCount,
          issue_count: data.issueCount,
          solution_count: data.solutionCount,
          solved_issues: data.issueFinishedCount,
          solving_issues_avg: data.issueConclusionAvg,
          late_issues: data.issueLateCount,
        })
        .catch(function (error) {
          return error
        });

        return res.status(200).send({
          response: "Relatório enviado para o e-mail " + email + "."
        })
      }

      // 6x por hora atualiza os parâmetros da job Cron-Job de acordo com as entradas de e-mails
      const minutes = new Date().toLocaleString('pt-BR', { minute: 'numeric' })
      if (auto && (minutes == "0" || minutes == "10" || minutes == "20" || minutes == "30" || minutes == "40" || minutes == "50")) {
        await axios.get(process.env.RTDB_ENDPOINT + '/email.json')
        .then(async (res) => {
          let url = "https://ticket-io-server.vercel.app/report?auto=true&"
          res.data.forEach(element => {
            url = url.concat("email="+element+"&")
          });
          url = url.slice(0, -1)
          await fetch(process.env.CRONJOB_ENDPOINT, {
            method: 'PATCH',
            body: JSON.stringify({
              job: {
                url: url,
              }
            }),
            headers: {
              'Authorization': 'Bearer '+process.env.CRONJOB_APIKEY,
              'Content-type': 'application/json',
            },
          }).catch(()=>console.log("Algum problema ao acessar Cron-Job"))
        })
      }

      console.log("okkk")

      if (!auto || (auto && data.cron == "* * * * *")){
        return await sendEmail()
      } else if (auto && data.cron == "0 0 * * 6") {
        const today = new Date().toLocaleString('pt-BR', { 
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
        })
        if (today == "sábado, 00:00") {
          return await sendEmail()
        }
        else return res.status(200).send({
          today: today,
          response: `Envio automático (0 0 * * 6), será enviado um e-mail apenas quando for requisitado em 'today'=='sábado, 00:00'.`
        })
      } else return res.status(200).send({
        response: `????`
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
    solved_issues: req.body.solved_issues,
    solving_issues_avg: req.body.solving_issues_avg,
    late_issues: req.body.late_issues
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

router.patch("/", (req, res, next) => {
  const cron = req.body.cron 
  mysql.getConnection((error, conn) => {
    if (error) return res.sendStatus(400);
    conn.query(`UPDATE \`report\` SET \`cron\` = "${cron}" WHERE id=1`, (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
          response: null,
        });
      }
      return res.status(201).send({
        message: "cron atualizado",
        id: result.id,
      });
    })
  })
})

module.exports = router
