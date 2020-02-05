const R = require('ramda')
const moment = require('moment')

exports.matchesSerializer = R.map((table) => {
  const matches = R.map((match) => {
    const homeTeam = match.homeTeam ? { id: match.homeTeam.id, logo: match.homeTeam.logo, name: match.homeTeam.name } : null
    const visitorTeam = match.visitorTeam ? { id: match.visitorTeam.id, logo: match.visitorTeam.logo, name: match.visitorTeam.name } : null

    return {
      id: match.id,
      name: match.name,
      index: match.index,
      rootIndex: match.rootIndex,
      scheduled: moment(match.scheduled).format('x'),
      homeScore: match.homeScore,
      visitorScore: match.visitorScore,
      homeTeam: homeTeam,
      visitorTeam: visitorTeam,
      userConfirmed: match.userConfirmed,
      pitch: match.pitch,
      referee: match.referee,
      refereeConfirmed: match.refereeConfirmed
    }
  })(table.matches)

  return {
    table: table.name,
    matches: matches
  }
})