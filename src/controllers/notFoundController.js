import { Router } from 'express'

const router = Router()

router.use((req, res, next) => {
  const error = new Error('not found')
  // @ts-ignore
  error.status = 404
  next(error)
})

router.use(
  /**
   * @param {Error} error
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  (error, req, res, next) => {
    // @ts-ignore
    res.status(error.status || 500)
    res.send({
      error: {
        message: error.message
      },
      rotasPrincipais: [
        req.protocol + '://' + req.headers.host + '/user',
        req.protocol + '://' + req.headers.host + '/group',
        req.protocol + '://' + req.headers.host + '/issue',
        req.protocol + '://' + req.headers.host + '/solution',
        req.protocol + '://' + req.headers.host + '/lero',
        req.protocol + '://' + req.headers.host + '/report'
      ]
    })
  }
)

export default router
