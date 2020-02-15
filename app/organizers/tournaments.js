const R = require('ramda')
const _ = require('lodash')
const Op = require('sequelize').Op
const { responseData, responseError } = require('../helpers/response')
const { tournamentSerializer, listTournamentTableSerializer, listTournamentTeamSerializer, availableTeamSerializer, listTournamentSerializer } = require('../response_format/tournament')
const { create,getById, updateTournament, getTounamentTable,
    getTeamInTable, getTounamentTeam, destroyAllTableResult, createTournamentTable, destroyAllTable,
    createTournamentTableResult, getAvailableTeam, createTournamentTeam, destroyTournamentTeam, getTounamentTeamById,
    destroyTableResult, updateTableResult, getTournaments
} = require('../queries/tournament_query')
const { destroyAllMatch, getTableId, removeTeamOutOfMatch, getHappeningMatch } = require('../queries/match_query')

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

    const [result, _] = await updateTournament(id, tournamentField)

    if (result == 0) {
        return responseError(res, 200, 404, 'Tournament did not exist')
    }

    const tournament = await getById(id)
    responseData(res, tournamentSerializer(tournament))
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
    console.log(tables)
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

    const tableIds = await getTableId(id)
    await destroyAllMatch(tableIds)
    await destroyAllTableResult(id)
    await destroyAllTable(id)

    const tableNumber = tournament.team % tournament.teamOfTable == 0 ? parseInt(tournament.team / tournament.teamOfTable) : Math.floor(tournament.team / tournament.teamOfTable) + 1

    const tableData = R.map((index) => ({
      name: 'Table ' + R.toUpper(alphabet[index]),
      tournamentId: id
    }), R.times(R.identity, tableNumber))

    const newTable = await createTournamentTable(tableData)
    const teams = await getTounamentTeam(id, [])
    const teamIds = _.shuffle(R.map((team) => team.dataValues.id)(teams))
    const teamInTable = R.splitEvery(teamIds.length / tableNumber, teamIds)

    const tounamentTableResultData = _.map(newTable, (table, index) => {
        const data = table.dataValues

        return R.map((teamId) => ({
            tableId: data.id,
            tournamentId: id,
            tournamentTeamId: teamId
        }))(teamInTable[index])
    })

    await createTournamentTableResult(R.flatten(tounamentTableResultData))

    const tables = await getTounamentTable(id)

    responseData(res, {
        tables: listTournamentTableSerializer(tables),
        teams: []
    })
}

exports.availableTeam = async (req, res) => {
    const { id, categoryId } = req.params

    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const data = R.filter((data) => {
        const obj = data.dataValues
        if (obj.tournament_teams.length == 0) {
            return true
        } else {
            return false
        }
    }, await getAvailableTeam(categoryId))

    responseData(res, availableTeamSerializer(data))
}

exports.addTeam = async (req, res) => {
    const { id, teamIds } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const teamData = R.map((teamId) => ({
      teamId: teamId,
      tournamentId: id,
      status: 'approved'
    }), teamIds)

    const tournamentTeamIds = R.map((team) => team.id)(await createTournamentTeam(teamData))
    const teams = await getTounamentTeamById(tournamentTeamIds)

    responseData(res, listTournamentTeamSerializer(teams))
}

exports.removeTeam = async (req, res) => {
    const { id, tournamentTeamIds } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    await removeTeamOutOfMatch(tournamentTeamIds)
    await destroyTournamentTeam(tournamentTeamIds)
    const teamIds = await getTeamInTable(id)
    const teams = await getTounamentTeam(id, teamIds)

    responseData(res, listTournamentTeamSerializer(teams))
}


exports.addTeamToTable = async (req, res) => {
    const { id, teamIds, tableId } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const tounamentTableResultData = R.map((teamId) => ({
        tableId: tableId,
        tournamentId: id,
        tournamentTeamId: teamId
    }))(teamIds)

    await createTournamentTableResult(R.flatten(tounamentTableResultData))

    const tables = await getTounamentTable(id)
    const teams = await getTounamentTeam(id, await getTeamInTable(id))

    responseData(res, {
        tables: listTournamentTableSerializer(tables),
        teams: listTournamentTeamSerializer(teams)
    })
}

exports.removeTeamToTable = async (req, res) => {
    const { id, tableResultId } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    await destroyTableResult(id, tableResultId)

    const tables = await getTounamentTable(id)
    const teams = await getTounamentTeam(id, await getTeamInTable(id))

    responseData(res, {
        tables: listTournamentTableSerializer(tables),
        teams: listTournamentTeamSerializer(teams)
    })
}

exports.moveTeamToTable = async (req, res) => {
    const { id, tableResultId, tableId } = req.body

    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const [result, _] = await updateTableResult({ id: tableResultId, tournamentId: id }, { tableId: tableId })

    if (result == 0) {
        return responseError(res, 200, 404, 'Move Team is fail')
    }

    const tables = await getTounamentTable(id)

    responseData(res, {
        tables: listTournamentTableSerializer(tables)
    })
}

exports.listTournament = async (req, res) => {
    const { type } = req.params
    let tournaments = []
    if (type == 'finished' ) {
        tournaments = await getTournaments({ userId: req.uid, endDate: { [Op.lt]: new Date() } })
    } else if (type == 'happening'){
        tournaments = await getTournaments({ userId: req.uid, endDate: { [Op.gt]: new Date() }, publish: true })
    } else {
        tournaments = await getTournaments({ userId: req.uid })
    }

    responseData(res, listTournamentSerializer(tournaments))
}

exports.happeningMatch = async (req, res) => {
    const { type } = req.params
    const tournaments = await getHappeningMatch({ userId: req.uid, endDate: { [Op.gt]: new Date() }, publish: true })

    responseData(res, tournaments)
}

