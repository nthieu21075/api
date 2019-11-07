const { create, basicInfo, update, teamManagement, generateTable, availableTeam, addTeam } = require('../../organizers/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/organizer/tournament/basic-info/:id', withAuth, asyncMiddleware(basicInfo))
  app.get('/api/organizer/tournament/team-management-info/:id', withAuth, asyncMiddleware(teamManagement))
  app.get('/api/organizer/tournament/:id/available-team/:categoryId', withAuth, asyncMiddleware(availableTeam))
  app.post('/api/organizer/tournament/add-team', withAuth, asyncMiddleware(addTeam))

  app.post('/api/organizer/tournament/generate-table', withAuth, asyncMiddleware(generateTable))
  app.post('/api/organizer/tournament/create', withAuth, upload.single('image'), asyncMiddleware(create))
  app.post('/api/organizer/tournament/update', withAuth, upload.single('image'), asyncMiddleware(update))
}
