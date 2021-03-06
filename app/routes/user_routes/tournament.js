const { listTournament, createTeam, joinTeam, userTeam, pendingRequest, tournamentDetail, searchTournament } = require('../../users/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/user/team', withAuth, asyncMiddleware(userTeam))
  app.get('/api/user/pending-request', withAuth, asyncMiddleware(pendingRequest))

  app.get('/api/user/tournaments/:categoryId', asyncMiddleware(listTournament))
  app.get('/api/user/tournament-detail/:tournamentId', asyncMiddleware(tournamentDetail))

  app.post('/api/user/search-tournament', asyncMiddleware(searchTournament))

  app.post('/api/user/create-team', withAuth, upload.single('logo'), asyncMiddleware(createTeam))
  app.post('/api/join-team', withAuth, asyncMiddleware(joinTeam))
}
