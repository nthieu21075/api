const withAuth = require('../middlewares/middleware')
const commonRoutes = require('./common_routes/common')
const organizerRoutes = require('./organizer_routes/index')
const userRoutes = require('./user_routes/index')
const adminRoutes = require('./admin_routes/index')

module.exports = app => {
    commonRoutes(app)
    organizerRoutes(app)
    userRoutes(app)
    adminRoutes(app)
}