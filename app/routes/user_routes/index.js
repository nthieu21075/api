const tournament = require('./tournament')
const profile = require('./profile')

module.exports = app => {
  tournament(app)
  profile(app)
}
