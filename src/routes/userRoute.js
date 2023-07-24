import { Router } from 'express'

import * as UserController from '../controllers/userController.js'

const router = Router()

router.post('/', UserController.createUser)
router.get('/', UserController.getAllUsers)
router.get('/:id', UserController.getUser)
router.patch('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

export default router
