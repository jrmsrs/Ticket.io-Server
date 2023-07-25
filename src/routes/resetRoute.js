import { Router } from 'express'

import * as ResetController from '../controllers/resetController.js'

const router = Router()

router.post('/', ResetController.resetDb)

export default router
