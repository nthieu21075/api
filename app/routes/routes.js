const withAuth = require('../middlewares/middleware')
const commonRoutes = require('./common_routes/common')

module.exports = app => {
    commonRoutes(app)

    app.post('/api/secret', withAuth, (req, res) => {
        responseData(res, {})
    })
}