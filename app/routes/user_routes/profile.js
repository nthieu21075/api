const { updateProfile, updatePassword } = require('../../users/profile')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')

module.exports = app => {
  app.post('/api/user/update-profile', withAuth, asyncMiddleware(updateProfile))
  app.post('/api/user/update-password', withAuth, asyncMiddleware(updatePassword))
}
