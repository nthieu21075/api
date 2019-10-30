const withAuth = require('../middlewares/middleware')
const commonRoutes = require('./common_routes/common')
const origanizerRoutes = require('./origanizer_routes/profile')

module.exports = app => {
    commonRoutes(app)
    origanizerRoutes(app)
}