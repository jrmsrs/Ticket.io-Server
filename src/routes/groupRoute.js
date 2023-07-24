import { Router } from 'express'

import * as GroupController from '../controllers/groupController.js'

const router = Router()

router.post('/', GroupController.createGroup)
router.get('/', GroupController.getAllGroups)
router.get('/:id', GroupController.getGroup)
router.patch('/:id', GroupController.updateGroup)
router.delete('/:id', GroupController.deleteGroup)

export default router
