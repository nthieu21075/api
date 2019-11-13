const { login, register, organizerLogin } = require('../../common/authentication')
const { asyncMiddleware } = require('../../middlewares/async_middleware')

module.exports = app => {
  app.post('/api/user/login', asyncMiddleware(login))
  app.post('/api/user/register', asyncMiddleware(register))
  app.post('/api/organizer/login', asyncMiddleware(organizerLogin))
}
