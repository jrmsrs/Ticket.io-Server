import { Router } from 'express'

import * as SolutionController from '../controllers/solutionController.js'

const router = Router()

router.post('/', SolutionController.createSolution)
router.get('/', SolutionController.getAllSolutions)
router.get('/:id', SolutionController.getSolution)
router.patch('/:id', SolutionController.updateSolution)
router.delete('/:id', SolutionController.deleteSolution)

export default router
