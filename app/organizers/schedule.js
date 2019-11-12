const R = require('ramda')
const _ = require('lodash')
const { responseData, responseError } = require('../helpers/response')
const { matchesSerializer } = require('../response_format/schedule')
const { getById, updateTournament, getTounamentTable } = require('../queries/tournament_query')
const { create: createMatch, getMatchOfTournament, destroyAllMatch, getTableId } = require('../queries/match_query')
const async = require("async")

exports.generateSchedule = async (req, res) => {
    const { id, scheduleType } = req.body
    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const [result, _] = await updateTournament(id, { scheduleType: scheduleType })
    const tableIds = await getTableId(id)

    await destroyAllMatch(tableIds)

    if (result == 0) {
        return responseError(res, 200, 404, 'Generate Schedule was failure')
    }

    const tables = await getTounamentTable(id)
    let matchesData = []
    await new Promise((resolve) => resolve()).then(_ => R.forEach((table) => {
        const tableResults = table.dataValues.table_results
        const teams = R.map((tableResult) => {
            const tournamentTeam = tableResult.dataValues.tournament_team.dataValues
            return { id: tournamentTeam.id }
        })(tableResults)
        const matches = singleElimination(tableResults.length, table.dataValues.id)
        matchesData = assignTeamToMatch(teams, matches)
    }, tables))


    await createMatch(matchesData)
    const matches = await getMatchOfTournament(id)

    responseData(res, matchesSerializer(matches.get({ plain: true }).tables))
}

exports.getSchedule =  async (req, res) => {
    const { id } = req.params

    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const matches = await getMatchOfTournament(id)

    responseData(res, matchesSerializer(matches.get({ plain: true }).tables))
}

const assignTeamToMatch = (teams, matches)  => {
  const match = _.reverse(matches)
  const matchTeam = _.chunk(_.shuffle(teams), 2)

  _.forEach(matchTeam, ([homeTeam, visitorTeam], index) => {
    match[index].homeTournamentTeamId = homeTeam ? homeTeam.id : null
    match[index].visitorTournamentTeamId = visitorTeam ? visitorTeam.id : null
  })

  return _.reverse(match)
}


const filterMatchTreeByRange = (range) => _.filter(range, (elem) => {
    if (elem >= 8) {
        return elem % 2 == 0 && elem % 4 == 0 && elem % 8 == 0
    } else if (elem >= 4) {
        return elem % 2 == 0 && elem % 4 == 0
    } else {
        return elem % 2 == 0
    }
})

const singleElimination = (teamLength, tableId) => {
    if (teamLength == 0) {
        return []
    }

    let range = []
    let bonusMatch = 0
    if (teamLength >= 8) {
        bonusMatch = teamLength % 8
    } else if (teamLength >= 4) {
        bonusMatch = teamLength % 4
    } else {
        bonusMatch = teamLength % 2
    }

    range = _.range(0, ((teamLength - bonusMatch) / 2) + 1, 2)

    const matchTree = filterMatchTreeByRange(range)
    return matchData(matchTree, bonusMatch, tableId)
}

const matchData = (range, bonusMatch, tableId) => {
    let arr = []
    let matchNumber = _.sum(range) + 1 + bonusMatch

    _.forEach(range, (index) => {
        if (index == 0) {
            arr.push({
                tableId: tableId,
                index: 1,
                name: 'Match ' + matchNumber,
                scheduled: 1499540400000 + (matchNumber * 3600 * 24) * 1000,
                homeTournamentTeamId: null,
                homeScore: null,
                visitorTournamentTeamId: null,
                visitorScore: null
            })
        } else {
            const matchRange = _.range(0, index, 1)
            _.forEach(matchRange, (matchIndex) => {
                matchNumber = matchNumber - 1
                const matchId = matchIndex + index
                const root = arr[parseInt(matchId / 2) - 1]

                arr.push({
                    tableId: tableId,
                    index: matchId,
                    name: 'Match ' + matchNumber,
                    scheduled: 1499540400000 + (matchNumber * 3600 * 24) * 1000,
                    rootIndex: root.index,
                    homeTournamentTeamId: null,
                    homeScore: null,
                    visitorTournamentTeamId: null,
                    visitorScore: null
                })
            })
        }
    })

    if (bonusMatch != 0) {
        let index = _.last(range) + 2
        if (range.length > 2) {
            index = _.last(range) + 4
        }

        _.forEach(_.range(0, bonusMatch), (matchIndex) => {
            matchNumber = matchNumber - 1
            const matchId = matchIndex + index
            const root = arr[parseInt(matchId / 2) - 1]

            arr.push({
                tableId: tableId,
                index: matchId,
                name: 'Match ' + matchNumber,
                scheduled: 1499540400000 + (matchNumber * 3600 * 24) * 1000,
                rootIndex: root.index,
                homeTournamentTeamId: null,
                homeScore: null,
                visitorTournamentTeamId: null,
                visitorScore: null
            })
        })
    }

    return arr
}