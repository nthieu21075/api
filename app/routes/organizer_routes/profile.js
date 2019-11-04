const { updateProfile, updatePassword } = require('../../organizers/profile')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')

module.exports = app => {
  app.post('/api/organizer/update-profile', withAuth, asyncMiddleware(updateProfile))
  app.post('/api/organizer/update-password', withAuth, asyncMiddleware(updatePassword))
}
