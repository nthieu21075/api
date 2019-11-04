const { create, show, update } = require('../../organizers/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/organizer/tournament/:id', withAuth, asyncMiddleware(show))
  app.post('/api/organizer/tournament/create', withAuth, upload.single('image'), asyncMiddleware(create))
  app.post('/api/organizer/tournament/update', withAuth, upload.single('image'), asyncMiddleware(update))
}
