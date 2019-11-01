const R = require('ramda')
const { responseData, responseError } = require('../helpers/response')
const { categoriesSerializer } = require('../response_format/category')
const { create } = require('../queries/tournament_query')

exports.create = async (req, res) => {
    const { name, shortDescription, description, team, categoryId } = req.body
    const tournament  = await create(
        {
            name: name,
            shortDescription: shortDescription,
            description: description,
            team: team,
            categoryId: categoryId,
            mainImageUrl: req.file ? R.replace('public', '', req.file.path) : '',
            userId: req.uid
        }
    )

    responseData(res, {})
}