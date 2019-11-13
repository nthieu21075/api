const R = require('ramda')
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { responseData, responseError } = require('../helpers/response')
const { tournamentSerializer, listTournamentTableSerializer, listTournamentTeamSerializer, availableTeamSerializer, listTournamentSerializer } = require('../response_format/tournament')
const { getTournaments
} = require('../queries/tournament_query')

exports.listTournament = async (req, res) => {
    const { categoryId } = req.params
    let tournaments

    if (categoryId == 'all' || categoryId == 'recomended') {
        tournaments = await getTournaments(
            {
                publish: true,
                endDate: { [Op.gt]: new Date() }
            }
        )
    } else {
        tournaments = await getTournaments(
            {
                categoryId: categoryId,
                publish: true,
                endDate: { [Op.gt]: new Date() }
            }
        )
     }
    responseData(res, listTournamentSerializer(tournaments))
}

exports.myTournament = async (req, res) => {
    const tournaments = await getTournaments(
        {
            publish: true,
            endDate: { [Op.gt]: new Date() }
        }
    )
    responseData(res, listTournamentSerializer(tournaments))
}

