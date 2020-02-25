const R = require('ramda')
const moment = require('moment')
const _ = require('lodash')
const Op = require('sequelize').Op
const { responseData, responseError } = require('../helpers/response')
const { matchesSerializer } = require('../response_format/schedule')
const { getById, updateTournament, getTounamentTable } = require('../queries/tournament_query')
const { create: createMatch, getMatchOfTournament, destroyAllMatch, getTableId, updateMatch, getTableResult, getMatchs, updateTableResult, getMatch, getNextMatch, updateMatchIndex } = require('../queries/match_query')
const { getPitchesByCategory } = require('../queries/pitch_query')
const { getRefereesByCategory } = require('../queries/user_query')

const async = require("async")

exports.updateMatchInfo = async (req, res) => {
    const { tournamentId, pitchId, refereeId, homeScore, visitorScore, matchId, scheduled, tableId, visitorTournamentTeamId, homeTournamentTeamId } = req.body
    const tournament = await getById(tournamentId)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    let fields = { pitchId: pitchId, userId: refereeId, scheduled: moment(parseInt(scheduled)) }

    if (visitorTournamentTeamId && homeTournamentTeamId) {
        fields['homeScore'] =  homeScore
        fields['visitorScore'] =  visitorScore
    }

    const [result, _] = await updateMatch(matchId, fields)

    if (result == 0) {
        return responseError(res, 200, 404, 'Update Match Info was failure')
    }

    const match = await getMatch(matchId)

    if (visitorTournamentTeamId && homeTournamentTeamId) {
        const nextMatch = await getNextMatch({ tableId: tableId, index: match.rootIndex })

        let winnerTeam = homeTournamentTeamId

        await updateTableResultInfo(tournamentId, homeTournamentTeamId, tableId)
        await updateTableResultInfo(tournamentId, visitorTournamentTeamId, tableId)

        if (homeScore < visitorScore) {
            winnerTeam = visitorTournamentTeamId
        }

        if (homeScore != visitorScore) {
            if (nextMatch){
                if (nextMatch.visitorTournamentTeamId == null && nextMatch.homeTournamentTeamId == null) {
                    await updateMatchIndex({ id: nextMatch.id }, { homeTournamentTeamId: winnerTeam })
                } else if (nextMatch.homeTournamentTeamId == visitorTournamentTeamId || nextMatch.homeTournamentTeamId == homeTournamentTeamId) {
                    await updateMatchIndex({ id: nextMatch.id }, { homeTournamentTeamId: winnerTeam })
                } else {
                    await updateMatchIndex({ id: nextMatch.id }, { visitorTournamentTeamId: winnerTeam })
                }
            }

        }
    }

    const matches = await getMatchOfTournament(tournamentId)
    const pitches = await getPitchesByCategory(tournament.categoryId)
    const referees = await getRefereesByCategory(tournament.categoryId)

    responseData(res, { matches: matchesSerializer(matches.get({ plain: true }).tables), pitches: pitches, referees: referees })
}

const updateTableResultInfo = async (tournamentId, teamTournamentId, tableId) => {
    let win = 0
    let lose = 0
    let wp = 0
    let point = 0

    const matches = await getMatchs({
        tableId: tableId,
        [Op.or]: [
          {
            visitorTournamentTeamId: teamTournamentId
          },
          {
            homeTournamentTeamId: teamTournamentId
          }
        ]
    })

    R.map((match) => {
        if(!match.homeScore || !match.visitorScore) {
            return
        }
        if (match.homeTournamentTeamId == teamTournamentId){
            if(match.homeScore > match.visitorScore) {
                win += 1
                point += 3
            } else if(match.homeScore < match.visitorScore) {
                lose += 1
                point -= 3

            } else {
                point +=1
            }
            wp += (match.homeScore - match.visitorScore)
        } else if (match.visitorTournamentTeamId == teamTournamentId) {
            if(match.visitorScore > match.homeScore) {
                win += 1
                point += 3
            } else if(match.visitorScore < match.homeScore) {
                lose += 1
                point -= 3
            } else {
                point +=1
            }

            wp += (match.visitorScore - match.homeScore)
        }
    }, matches)

    await updateTableResult(
        { tableId: tableId, tournamentTeamId: teamTournamentId, tournamentId: tournamentId },
        { win: win, lose: lose, wp: wp, point: point }
    )
}

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
        matchesData = R.concat(matchesData, assignTeamToMatch(teams, matches))
    }, tables))


    await createMatch(matchesData)
    const matches = await getMatchOfTournament(id)
    const pitches = await getPitchesByCategory(tournament.categoryId)
    const referees = await getRefereesByCategory(tournament.categoryId)

    await updateTableResult(
        { tournamentId: tournament.id },
        { win: 0, lose: 0, wp: 0, point: 0 }
    )

    responseData(res, { matches: matchesSerializer(matches.get({ plain: true }).tables), pitches: pitches, referees: referees })
}

exports.getSchedule =  async (req, res) => {
    const { id } = req.params

    const tournament = await getById(id)

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    const matches = await getMatchOfTournament(id)
    const pitches = await getPitchesByCategory(tournament.categoryId)
    const referees = await getRefereesByCategory(tournament.categoryId)

    responseData(res, { matches: matchesSerializer(matches.get({ plain: true }).tables), pitches: pitches, referees: referees })
}

const assignTeamToMatch = (teams, matches)  => {
  const match = _.sortBy(matches, [function(o) { return o.name }])

  const matchTeam = _.chunk(_.shuffle(teams), 2)

  _.forEach(matchTeam, ([homeTeam, visitorTeam], index) => {
    match[index].homeTournamentTeamId = homeTeam ? homeTeam.id : null
    match[index].visitorTournamentTeamId = visitorTeam ? visitorTeam.id : null
  })

  return match
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
    console.log(range)
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