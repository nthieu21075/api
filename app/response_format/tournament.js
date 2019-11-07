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
    tableId: data.id,
    teams: R.map((tableResult) => {
      const obj = tableResult.get({plain: true})
      const team = obj.tournament_team.team
      return {
        tableId: obj.tableId,
        tableResultId: obj.id,
        tournamentTeamId: obj.tournamentTeamId,
        key: team.name + team.id,
        teamId: team.id,
        info: {
          name: team.name,
          logo: team.logo
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
    tournamentTeamId: tournamentTeam.dataValues.id,
    id: obj.id,
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
exports.availableTeamSerializer = R.map((team) => {
  return {
    id: team.id,
    name: team.name,
    logo: team.logo
  }
})

