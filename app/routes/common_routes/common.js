const authentication = require('./authentication')
const category = require('./category')

module.exports = app => {
  authentication(app)
  category(app)
}
