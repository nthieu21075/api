const { updateProfile } = require('../../origanizers/profile')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')

module.exports = app => {
  app.post('/api/origanizer/update-profile', withAuth, asyncMiddleware(updateProfile))
}
