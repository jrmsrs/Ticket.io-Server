import { Router } from 'express'

import * as ReportController from '../controllers/reportController.js'

const router = Router()

router.get('/:id', ReportController.getReport)
router.get('/', ReportController.sendReport)
router.post('/', ReportController.createReport)
router.patch('/', ReportController.updateReport)

export default router
