const R = require('ramda')
const { responseData, responseError } = require('../helpers/response')
const { tournamentSerializer } = require('../response_format/tournament')
const { create, getById, updateTournament } = require('../queries/tournament_query')

exports.create = async (req, res) => {
    const { name, shortDescription, description, team, categoryId, startDate, endDate } = req.body
    const tournament  = await create(
        {
            name: name,
            shortDescription: shortDescription,
            description: description,
            team: team,
            categoryId: categoryId,
            startDate: startDate,
            endDate: endDate,
            mainImageUrl: req.file ? R.replace('public', '', req.file.path) : '',
            userId: req.uid
        }
    )

    responseData(res, { id: tournament.get({plain: true}).id })
}

exports.update = async (req, res) => {
    const { name, shortDescription, description, team, categoryId, startDate, endDate, id, publish, removeImage } = req.body
    let tournamentField = {
        name: name,
        shortDescription: shortDescription,
        description: description,
        team: team,
        categoryId: categoryId,
        startDate: startDate,
        endDate: endDate,
        publish: publish
    }

    if (req.file) {
        tournamentField = R.merge(tournamentField, { mainImageUrl: R.replace('public', '', req.file.path) })
    }

    if (removeImage) {
        tournamentField = R.merge(tournamentField, { mainImageUrl: '' })
    }

    const [result, tournament] = await updateTournament(id, tournamentField)

    if (result == 0) {
        return responseError(res, 200, 401, 'Tournament did not exist')
    }

    responseData(res, {})
}

exports.show = async (req, res) => {
    const { id } = req.params
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    responseData(res, tournamentSerializer(tournament))
}