import GroupRoute from './groupRoute.js'
import IssueRoute from './issueRoute.js'
import LeroRoute from './leroRoute.js'
import NotFoundRoute from './notFoundRoute.js'
import ReportRoute from './reportRoute.js'
import SolutionRoute from './solutionRoute.js'
import UserRoute from './userRoute.js'
import ResetRoute from './resetRoute.js'

/**
 * @param {import('express').Application} app
 */
export default app => {
  app.use('/group', GroupRoute)
  app.use('/issue', IssueRoute)
  app.use('/lero', LeroRoute)
  app.use('/report', ReportRoute)
  app.use('/solution', SolutionRoute)
  app.use('/user', UserRoute)
  app.use('/reset', ResetRoute)
  app.use('*', NotFoundRoute)
}
