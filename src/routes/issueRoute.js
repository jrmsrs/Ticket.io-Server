import { Router } from 'express'

import * as IssueController from '../controllers/issueController.js'

const router = Router()

router.post('/', IssueController.createIssue)
router.get('/', IssueController.getAllIssues)
router.get('/:id', IssueController.getIssue)
router.patch('/:id', IssueController.updateIssue)
router.delete('/:id', IssueController.deleteIssue)

export default router
