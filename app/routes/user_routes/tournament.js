const { listTournament, createTeam, joinTeam } = require('../../users/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/user/tournaments/:categoryId', asyncMiddleware(listTournament))
  app.post('/api/user/create-team', withAuth, upload.single('logo'), asyncMiddleware(createTeam))
  app.post('/api/join-team', withAuth, asyncMiddleware(joinTeam))
}
