const { invitedMatch, updateMatchInfo, profileDetail, updateProfile, updatePassword } = require('../../referees/index')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/referee/invited-match/:type', withAuth, asyncMiddleware(invitedMatch))
  app.post('/api/referee/update-match-info', withAuth, asyncMiddleware(updateMatchInfo))
  app.get('/api/referee/profile-detail', withAuth, asyncMiddleware(profileDetail))
  app.post('/api/referee/update-profile', withAuth, asyncMiddleware(updateProfile))
  app.post('/api/referee/update-password', withAuth, asyncMiddleware(updatePassword))
}
