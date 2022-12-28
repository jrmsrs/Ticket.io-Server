require("dotenv").config();

var mysql = require("mysql");

var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  //timezone: 'gmt+3',
  multipleStatements: true,
  connectionLimit: 10,
  acquireTimeout: 6000000,
});
// Testar db
// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('Resultado: ', results[0].solution);
// });
exports.pool = pool;
