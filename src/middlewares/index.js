import { urlencoded, json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fileupload from 'express-fileupload'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.use(cors())
  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(fileupload())
  app.use(morgan('dev'))
}
