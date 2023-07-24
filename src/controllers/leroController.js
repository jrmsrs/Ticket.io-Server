import { lero } from 'lerolero'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getLerolero = (req, res, next) => {
  return res.send({
    issueTitleLero: lero.issueTitleLero(),
    issueDescLero: lero.issueDescLero(),
    solutionTitleLero: lero.solutionTitleLero(),
    solutionDescLero: lero.solutionDescLero(),
    solutionDescLeroPlus: lero.solutionDescLeroPlus()
  })
}

export { getLerolero }
