const { create, basicInfo, update, teamManagement, generateTable, availableTeam, addTeam, removeTeam, addTeamToTable, removeTeamToTable, moveTeamToTable, listTournament } = require('../../organizers/tournaments')
const { generateSchedule, getSchedule } = require('../../organizers/schedule')
const { pendingRequest } = require('../../organizers/pendingRequest')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/organizer/tournament/pending-request', withAuth, asyncMiddleware(pendingRequest))
  app.get('/api/organizer/tournament/basic-info/:id', withAuth, asyncMiddleware(basicInfo))
  app.get('/api/organizer/tournament/team-management-info/:id', withAuth, asyncMiddleware(teamManagement))
  app.get('/api/organizer/tournament/:id/available-team/:categoryId', withAuth, asyncMiddleware(availableTeam))
  app.post('/api/organizer/tournament/add-team', withAuth, asyncMiddleware(addTeam))
  app.post('/api/organizer/tournament/remove-team', withAuth, asyncMiddleware(removeTeam))

  app.get('/api/organizer/tournament/list', withAuth, asyncMiddleware(listTournament))
  app.post('/api/organizer/tournament/add-team-to-table', withAuth, asyncMiddleware(addTeamToTable))
  app.post('/api/organizer/tournament/remove-team-to-table', withAuth, asyncMiddleware(removeTeamToTable))
  app.post('/api/organizer/tournament/move-team-to-table', withAuth, asyncMiddleware(moveTeamToTable))

  app.post('/api/organizer/tournament/generate-schedule', withAuth, asyncMiddleware(generateSchedule))
  app.get('/api/organizer/tournament/get-schedule/:id', withAuth, asyncMiddleware(getSchedule))

  app.post('/api/organizer/tournament/generate-table', withAuth, asyncMiddleware(generateTable))
  app.post('/api/organizer/tournament/create', withAuth, upload.single('image'), asyncMiddleware(create))
  app.post('/api/organizer/tournament/update', withAuth, upload.single('image'), asyncMiddleware(update))
}
