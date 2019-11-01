const jwt = require('jsonwebtoken')
const R = require('ramda')
const { responseData, responseError } = require('../helpers/response')
const { categoriesSerializer } = require('../response_format/category')
const { getAll, findOrCreate } = require('../queries/category_query')

exports.category = async (req, res) => {
    const categories  = await getAll()
    console.log(categories)
    responseData(res, { categories: categoriesSerializer(categories) })
}

exports.createCategory = async (req, res) => {
    const { name } = req.body
    const filePath = R.replace('public', '', req.file.path)
    const [category, created]  = await findOrCreate({ name: name }, { imageUrl: filePath })

    if (!created) {
       return responseError(res, 200, 401, 'Category is exsited')
    }

    responseData(res, {})
}