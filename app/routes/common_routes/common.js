const { login, register } = require('../../common/authentication')
const { asyncMiddleware } = require('../../middlewares/async_middleware')

module.exports = app => {
  app.post('/api/login', asyncMiddleware(login))
  app.post('/api/register', asyncMiddleware(register))
}
