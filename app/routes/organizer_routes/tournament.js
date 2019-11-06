const { create, basicInfo, update, teamManagement } = require('../../organizers/tournaments')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/organizer/tournament/basic-info/:id', withAuth, asyncMiddleware(basicInfo))
  app.get('/api/organizer/tournament/team-management-info/:id', withAuth, asyncMiddleware(teamManagement))
  app.post('/api/organizer/tournament/create', withAuth, upload.single('image'), asyncMiddleware(create))
  app.post('/api/organizer/tournament/update', withAuth, upload.single('image'), asyncMiddleware(update))
}
