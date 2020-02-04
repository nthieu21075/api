const { organizers, referees, creatrOrganizer, creatrReferee, pitches, createPitch, categories, createCategory, createManual, getManual, removeManual,
  organizerDetail, updateOrganizer, refereeDetail, updateReferee, pitchDetail, updatePitch

} = require('../../admins/index')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.post('/api/admins/create-organizer', withAuth, asyncMiddleware(creatrOrganizer))
  app.get('/api/admins/organizers', withAuth, asyncMiddleware(organizers))
  app.get('/api/admins/organizer-detail/:id', withAuth, asyncMiddleware(organizerDetail))
  app.post('/api/admins/update-organizer', withAuth, asyncMiddleware(updateOrganizer))

  app.get('/api/admins/referees', withAuth, asyncMiddleware(referees))
  app.post('/api/admins/create-referee', withAuth, asyncMiddleware(creatrReferee))
  app.get('/api/admins/referee-detail/:id', withAuth, asyncMiddleware(refereeDetail))
  app.post('/api/admins/update-referee', withAuth, asyncMiddleware(updateReferee))

  app.get('/api/admins/pitches', withAuth, asyncMiddleware(pitches))
  app.post('/api/admins/create-pitch', withAuth, upload.single('image'), asyncMiddleware(createPitch))
  app.get('/api/admins/pitch-detail/:id', withAuth, asyncMiddleware(pitchDetail))
  app.post('/api/admins/update-pitch', withAuth, upload.single('image'), asyncMiddleware(updatePitch))

  app.get('/api/admins/categories', withAuth, asyncMiddleware(categories))
  app.post('/api/admins/create-category', withAuth, upload.single('image'), asyncMiddleware(createCategory))

  app.post('/api/admins/create-manual', upload.array('files'), asyncMiddleware(createManual))
  app.get('/api/admins/manual', withAuth, asyncMiddleware(getManual))
  app.get('/api/admins/remove-manual/:id', withAuth, asyncMiddleware(removeManual))
}
