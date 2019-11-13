const { category, createCategory } = require('../../common/category')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.get('/api/categories', asyncMiddleware(category))
  app.post('/api/category/create', withAuth, upload.single('image'), asyncMiddleware(createCategory))
}
