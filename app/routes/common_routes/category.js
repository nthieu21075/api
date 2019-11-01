const { category, createCategory } = require('../../common/category')
const { asyncMiddleware } = require('../../middlewares/async_middleware')
const withAuth = require('../../middlewares/middleware')
const { upload } = require('../../helpers/uploader')

module.exports = app => {
  app.post('/api/categories', withAuth, asyncMiddleware(category))
  app.post('/api/create-category', withAuth, upload.single('image'), asyncMiddleware(createCategory))
}
