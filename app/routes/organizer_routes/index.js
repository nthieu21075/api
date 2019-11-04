const profile = require('./profile')
const tournament = require('./tournament')

module.exports = app => {
  profile(app)
  tournament(app)
}
