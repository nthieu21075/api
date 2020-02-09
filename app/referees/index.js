const R = require('ramda')
const bcrypt = require('bcrypt')
const moment = require('moment')
const Op = require('sequelize').Op
const _ = require('lodash')
const asyncMiddleware = require('../middlewares/async_middleware')
const { responseData, responseError } = require('../helpers/response')
const { getRefereeMatch, getRefereeTournament, updateTableResult, getMatch, getNextMatch, updateMatchIndex, updateMatch , getMatchs} = require('../queries/match_query')
const { getById } = require('../queries/tournament_query')

exports.invitedMatch = async (req, res) => {
    const { type } = req.params

    let allMatch = []

    if (type == 'happeningMatch'){
        allMatch = await getRefereeMatch({
            userId: req.uid,
            refereeConfirmed: false,
            [Op.and]: [
              {
                scheduled: {[Op.gt]: moment().startOf('day') }
              },
              {
                scheduled: {[Op.lt]: moment().endOf('day') }
              }
            ]
        })
    } else if (type == 'finishedMatch') {
        allMatch = await getRefereeMatch({ userId: req.uid, refereeConfirmed: true })
    } else {
        allMatch = await getRefereeMatch({ userId: req.uid, refereeConfirmed: false })
    }

    let tournamentIds = []

    R.map(match => {
      tournamentIds.push(match.table.tournamentId)
    })(allMatch)

    responseData(res, await getRefereeTournament(req.uid, { id: { [Op.in]: _.uniq(tournamentIds) }}))
}

exports.updateMatchInfo = async (req, res) => {
    const { tournamentId, homeScore, visitorScore, matchId, tableId } = req.body
    const tournament = await getById(tournamentId)
    const match = await getMatch(matchId)
    const visitorTournamentTeamId = match.visitorTournamentTeamId
    const homeTournamentTeamId = match.homeTournamentTeamId
    let fields = {}

    if (!tournament) {
        responseError(res, 200, 400, 'Tournament not found')
    }

    if (visitorTournamentTeamId && homeTournamentTeamId) {
        fields['homeScore'] =  homeScore
        fields['visitorScore'] =  visitorScore
        fields['refereeConfirmed'] = true
    }

    const [result, _] = await updateMatch(matchId, fields)

    if (result == 0) {
        return responseError(res, 200, 404, 'Update Match Info was failure')
    }


    if (visitorTournamentTeamId && homeTournamentTeamId) {
        const nextMatch = await getNextMatch({ tableId: tableId, index: match.rootIndex })

        let winnerTeam = homeTournamentTeamId
        await updateTableResultInfo(tournamentId, homeTournamentTeamId, tableId)
        await updateTableResultInfo(tournamentId, visitorTournamentTeamId, tableId)

        if (homeScore < visitorScore) {
            winnerTeam = visitorTournamentTeamId
        }

        if (nextMatch.visitorTournamentTeamId == null && nextMatch.homeTournamentTeamId == null) {
            await updateMatchIndex({ id: nextMatch.id }, { homeTournamentTeamId: winnerTeam })
        } else {
            await updateMatchIndex({ id: nextMatch.id }, { visitorTournamentTeamId: winnerTeam })
        }
    }

    responseData(res)
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
        } else {
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