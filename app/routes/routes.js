const withAuth = require('../middlewares/middleware')
const commonRoutes = require('./common_routes/common')
const organizerRoutes = require('./organizer_routes/index')

module.exports = app => {
    commonRoutes(app)
    organizerRoutes(app)
}