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
      publish: tournament.publish,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt
    }
  }
}

exports.tournamentSerializer = tournamentSerializer
exports.tournamentsSerializer = R.map(tournamentSerializer)