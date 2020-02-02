const { organizers, referees, creatrOrganizer, creatrReferee } = require('../../admins/index')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')

module.exports = app => {
  app.post('/api/admins/create-organizer', withAuth, asyncMiddleware(creatrOrganizer))
  app.get('/api/admins/organizers', withAuth, asyncMiddleware(organizers))
  app.get('/api/admins/referees', withAuth, asyncMiddleware(referees))
  app.post('/api/admins/create-referee', withAuth, asyncMiddleware(creatrReferee))
}
