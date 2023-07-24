import express from 'express'

import middlewares from './middlewares/index.js'
import routes from './routes/index.js'
import routeNotFound from './controllers/notFoundController.js'

const app = express()
middlewares(app)
routes(app)

app.use(routeNotFound)

export default app
