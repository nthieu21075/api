const { organizers, referees, creatrOrganizer } = require('../../admins/index')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')

module.exports = app => {
  app.post('/api/admins/create-organizer', withAuth, asyncMiddleware(creatrOrganizer))
  app.get('/api/admins/organizers', withAuth, asyncMiddleware(organizers))
  app.get('/api/admins/referees', withAuth, asyncMiddleware(referees))
}
