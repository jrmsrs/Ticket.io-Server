import { pool } from '../mysql.js'
import fs from 'fs'

export const resetDb = (req, res, next) => {
  const dbQuery = fs.readFileSync(process.cwd() + '/resetDb.sql', 'utf8')

  pool.getConnection((error, conn) => {
    if (error) return res.sendStatus(400)
    conn.query(
      dbQuery,
      (error, result, fields) => {
        conn.release()
        if (error) {
          return res.status(500).send({
            error,
            response: null
          })
        }
        return res.status(200).send({
          message: 'Database reseted'
        })
      })
  })
}
