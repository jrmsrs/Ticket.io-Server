const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios")
const cron = require('node-cron');
const mysql = require("./mysql").pool;
const app = express();

const routeUser = require("./routes/user");
const routeGroup = require("./routes/group");
const routeIssue = require("./routes/issue");
const routeLero = require("./routes/lero");
const routeReport = require("./routes/report");

const routeNotFound = require("./routes/notFound");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

app.use(morgan("dev"));
app.use("/user", routeUser);
app.use("/group", routeGroup);
app.use("/issue", routeIssue);
app.use("/lero", routeLero);
app.use("/report", routeReport);
app.use(routeNotFound);

const defaultOpt = {
  scheduled: false,
  timezone: "America/Sao_Paulo"
}

// Envia relatório todo sábado
const everySat = cron.schedule("0,30 0 0 * * 7", function() {
  sendEmail()
  console.log("osssi")
}, defaultOpt);

// Envia relatório a cada minuto
const everyMin = cron.schedule("10 * * * * *", function() {
  axios.get('https://ticket-io-auth-default-rtdb.firebaseio.com/email.json')
  .then((res) => {
    axios.get(process.env.HOST+'/report', {
      params: { email: res.data }
    })
    .catch((error)=>console.log(error))
  })
  .catch((error)=>console.log(error))
}, defaultOpt);

// Verifica se cron foi alterado no DB a cada minuto
cron.schedule("* * * * *", function() {
  mysql.getConnection((error, conn) => {
    if (error) console.log(400);
    conn.query(`SELECT * FROM \`report\` WHERE \`id\`=1`, (error, result, fields) => {
      conn.release();
      if (error) console.log(500);
      switch (result[0].cron) {
        case "* * * * *":
          console.log("Enviando email a cada minuto");
          everySat.stop()
          everyMin.start()
          break;
        case "0 0 * * 6":
          console.log("Enviando email todo sábado");
          everySat.start()
          everyMin.stop()
          break;
        default:
          break;
      }
    })
  })
});

module.exports = app;
