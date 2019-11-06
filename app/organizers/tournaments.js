const R = require('ramda')
const _ = require('lodash')
const { responseData, responseError } = require('../helpers/response')
const { tournamentSerializer, listTournamentTableSerializer, listTournamentTeamSerializer } = require('../response_format/tournament')
const { create,getById, updateTournament, getTounamentTable,
    getTeamInTable, getTounamentTeam, destroyAllTableResult, createTounamentTable, destroyAllTable,
    createTounamentTableResult
} = require('../queries/tournament_query')

const alphabet = R.split('', 'abcdefghijklmnopqrstuvwxyz')

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
    const { name, shortDescription, description, team, categoryId, startDate, endDate, id, publish, removeImage, teamOfTable } = req.body
    let tournamentField = {
        teamOfTable: teamOfTable,
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
        return responseError(res, 200, 404, 'Tournament did not exist')
    }

    responseData(res, {})
}

exports.basicInfo = async (req, res) => {
    const { id } = req.params
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    responseData(res, tournamentSerializer(tournament))
}

exports.teamManagement = async (req, res) => {
    const { id } = req.params
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const tables = await getTounamentTable(id)
    const teamIds = await getTeamInTable(id)
    const teams = await getTounamentTeam(id, teamIds)

    responseData(res, {
        tables: listTournamentTableSerializer(tables),
        teams: listTournamentTeamSerializer(teams)
    })
}

exports.generateTable = async (req, res) => {
    const { id } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    await destroyAllTableResult(id)
    await destroyAllTable(id)

    const tableNumber = tournament.team % tournament.teamOfTable == 0 ? parseInt(tournament.team / tournament.teamOfTable) : Math.floor(tournament.team / tournament.teamOfTable) + 1

    const tableData = R.map((index) => ({
      name: 'Table ' + R.toUpper(alphabet[index]),
      tournamentId: id
    }), R.times(R.identity, tableNumber))

    const newTable = await createTounamentTable(tableData)
    const teams = await getTounamentTeam(id, [])
    const teamIds = _.shuffle(R.map((team) => team.dataValues.id)(teams))
    const teamInTable = R.splitEvery(teamIds.length / tableNumber, teamIds)
    console.log(teamInTable)
    const tounamentTableResultData = _.map(newTable, (table, index) => {
        const data = table.dataValues

        return R.map((teamId) => ({
            tableId: data.id,
            tournamentId: id,
            tournamentTeamId: teamId
        }))(teamInTable[index])
    })

    await createTounamentTableResult(R.flatten(tounamentTableResultData))

    const tables = await getTounamentTable(id)

    responseData(res, {
        tables: listTournamentTableSerializer(tables),
        teams: []
    })
}