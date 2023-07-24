import { Router } from 'express'

import * as LeroController from '../controllers/leroController.js'

const router = Router()

router.get('/', LeroController.getLerolero)

export default router
