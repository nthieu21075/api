const { create } = require('../../origanizers/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.post('/api/origanizer/tournament/create', withAuth, upload.single('image'), asyncMiddleware(create))
}
