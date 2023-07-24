import { createPool } from 'mysql'
import 'dotenv/config'

const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true,
  connectionLimit: 10,
  acquireTimeout: 6000000
})

const _pool = pool
export { _pool as pool }
