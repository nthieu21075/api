const { organizers, referees, creatrOrganizer, creatrReferee, pitches, createPitch } = require('../../admins/index')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.post('/api/admins/create-organizer', withAuth, asyncMiddleware(creatrOrganizer))
  app.get('/api/admins/organizers', withAuth, asyncMiddleware(organizers))
  app.get('/api/admins/referees', withAuth, asyncMiddleware(referees))
  app.post('/api/admins/create-referee', withAuth, asyncMiddleware(creatrReferee))

  app.get('/api/admins/pitches', withAuth, asyncMiddleware(pitches))
  app.post('/api/admins/create-pitch', withAuth, upload.single('image'), asyncMiddleware(createPitch))
}
