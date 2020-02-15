const R = require('ramda')
const moment = require('moment')
const _ = require('lodash')

exports.matchesSerializer = R.map((table) => {
  const matches = R.map((match) => {

    const homeTeam = match.homeTournamentTeam && match.homeTournamentTeam.team? { tournamentId: match.homeTournamentTeam.id, id: match.homeTournamentTeam.team.id, logo: match.homeTournamentTeam.team.logo, name: match.homeTournamentTeam.team.name } : null
    const visitorTeam = match.visitorTournamentTeam && match.visitorTournamentTeam.team? { tournamentId: match.visitorTournamentTeam.id, id: match.visitorTournamentTeam.team.id, logo: match.visitorTournamentTeam.team.logo, name: match.visitorTournamentTeam.team.name } : null

    return {
      id: match.id,
      name: match.name,
      index: match.index,
      rootIndex: match.rootIndex,
      scheduled: moment(match.scheduled).format('x'),
      tableId: match.tableId,
      homeScore: match.homeScore,
      visitorScore: match.visitorScore,
      homeTeam: homeTeam,
      visitorTeam: visitorTeam,
      userConfirmed: match.userConfirmed,
      pitch: match.pitch,
      referee: match.referee,
      refereeConfirmed: match.refereeConfirmed
    }
  })(_.sortBy(table.matches, [function(o) { return o.index }]))

  return {
    table: table.name,
    matches: matches
  }
})