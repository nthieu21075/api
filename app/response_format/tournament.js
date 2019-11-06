const R = require('ramda')

const tournamentSerializer = (tournament) => {
  return {
    basicInformation: {
      id: tournament.id,
      name: tournament.name,
      imageUrl: tournament.mainImageUrl,
      shortDescription: tournament.shortDescription,
      description: tournament.description,
      category: {
        id: tournament['category.id'],
        name: tournament['category.name'],
        imageUrl: tournament['category.imageUrl']
      },
      team: tournament.team,
      teamOfTable: tournament.teamOfTable,
      publish: tournament.publish,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt
    }
  }
}

const tournamentTableSerializer = (table) => {
  const data = table.dataValues
  return {
    name: data.name,
    teams: R.map((tableResult) => {
      const obj = tableResult.get({plain: true})
      return {
        key: obj.team.name + obj.team.id,
        info: {
          name: obj.team.name,
          logo: obj.team.logo
        },
        point: obj.point,
        win: obj.win,
        lose: obj.lose,
        wp: obj.wp
      }
    })(data.table_results),
  }
}

const tournamentTeamSerializer = (tournamentTeam) => {
  const obj = tournamentTeam.dataValues.team.dataValues
  return {
    name: obj.name,
    logo: obj.logo
  }
}

exports.tournamentSerializer = tournamentSerializer
exports.tournamentsSerializer = R.map(tournamentSerializer)

exports.tournamentTableSerializer = tournamentTableSerializer
exports.listTournamentTableSerializer = R.map(tournamentTableSerializer)

exports.tournamentTeamSerializer = tournamentTeamSerializer
exports.listTournamentTeamSerializer = R.map(tournamentTeamSerializer)

