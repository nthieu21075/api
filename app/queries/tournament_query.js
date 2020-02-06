const Sequelize = require('sequelize')
const Op = Sequelize.Op
const R = require('ramda')
const { Tournament, TableResult, TournamentTeam, Table, Team, User, Match } = require('../../models/models')

exports.getByfield = (fields) => Tournament.findAll({ where: fields, include: 'category', raw: true })

exports.create = (fields) => Tournament.create(fields)

exports.createTeam = (fields) => Team.create(fields)

exports.getById = (id) => Tournament.findOne({ where: { id: id }, include: ['category'], raw: true })

exports.updateTournament = (id, fields) => Tournament.update(fields, { returning: true, where: { id: id } })

exports.searchTournament = (keyword, type) => {
  if (type == 'organizer') {
    return Tournament.findAll({
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`
        }
      }
    })
  } else {
    return Tournament.findAll({
      where: {
        publish: true,
        name: {
          [Op.iLike]: `%${keyword}%`
        }
      }
    })
  }
}

exports.getTournament = (tournamentId) => Tournament.findOne(
  {
    where: { id: tournamentId, publish: true },
    include: [
      {
        model: Table,
        include: [
          {
            model: Match,
            include: [ 'homeTeam', 'visitorTeam' ]
          },
          {
            model: TableResult,
            include: [
              {
                model: TournamentTeam,
                include: [
                  {
                    model: Team
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
)

exports.getTounamentTable = (tournamentId) => Table.findAll(
  { where:
    { tournamentId: tournamentId },
    include: [
      {
        model: TableResult,
        include: [
          {
            model: TournamentTeam,
            include: [
              {
                model: Team
              }
            ]
          }
        ]
      }
    ],
    order: [
      [ 'name', 'ASC'],
      [ {model: TableResult}, 'point', 'DESC']
    ]
  }
)

exports.createTournamentTable = (arrFields) => Table.bulkCreate(arrFields)
exports.createTournamentTableResult = (arrFields) => TableResult.bulkCreate(arrFields)
exports.createTournamentTeam = (arrFields) => TournamentTeam.bulkCreate(arrFields)

exports.getTounamentTeamById = (ids) => TournamentTeam.findAll(
  { where:
    {
      id: {
        [Op.in]: ids
      }
    },
    include: [
      { model: Team }
    ]
  }
)

exports.getTounamentTeam = (tournamentId, excludeTournamentTeamIds) => TournamentTeam.findAll(
  { where:
    {
      tournamentId: tournamentId,
      status: 'approved',
      id: {
        [Op.notIn]: excludeTournamentTeamIds
      }
    },
    include: [
      { model: Team }
    ]
  }
)

exports.getTeamInTable = (tournamentId) => R.pluck('tournamentTeamId')(TableResult.findAll({ where: { tournamentId: tournamentId }, raw: true }))

exports.destroyAllTableResult = (tournamentId) => TableResult.destroy({
  where: {
    tournamentId: tournamentId
  }
})

exports.destroyTournamentTeam = (tournamentIds) => TournamentTeam.destroy({
  where: {
    id: {
      [Op.in]: tournamentIds
    }
  }
})

exports.destroyTableResult = (tournamentId, tableResultId) => TableResult.destroy({
  where: {
    id: tableResultId,
    tournamentId: tournamentId
  }
})

exports.destroyAllTable = (tournamentId) => Table.destroy({
  where: {
    tournamentId: tournamentId
  }
})

exports.getAvailableTeam = (categoryId) => Team.findAll(
  { where: {
      categoryId: categoryId
    },
    include: [{ model: TournamentTeam }],
    order: [
      [ 'name', 'ASC']
    ]
  }
)

exports.updateTableResult = (queryField, fields) => TableResult.update(fields, { returning: true, where: queryField })

exports.getTournaments = (fields) => Tournament.findAll(
  { where: fields,
    include: [
    'organizer',
    {
      model: TournamentTeam
    }
    ],
    order: [
      [ 'createdAt', 'DESC']
    ]
  }
)


exports.getUserTeam = (userId) => Team.findAll(
  { where: {
      userId: userId
    },
    include: [{ model: TournamentTeam }],
    order: [
      [ 'name', 'ASC']
    ]
  }
)

exports.getUserTournamentTeam = (userId) => TournamentTeam.findAll(
  {
    include: [
      {
        model: Team,
        where: {
          userId: userId
        },
      }
    ]
  }
)

exports.getPendingRequest = () => TournamentTeam.findAll(
  { where:
    {
      status: 'pending',
    },
    include: [
      {
        model: Team,
        include: [ 'own' ]
      },
      {
        model: Tournament,
        include: [ 'organizer' ]
      }
    ]
  }
)

exports.updateTournamentTeam = (id, fields) => TournamentTeam.update(fields, {
  where: {
    id: id
  },
  raw: true
})

exports.getUserPendingRequest = (userId) => TournamentTeam.findAll(
  { where:
    {
      status: 'pending',
    },
    include: [
      {
        model: Team,
        include: [ 'own' ],
        where: {
          userId: userId
        }
      },
      {
        model: Tournament,
        include: [ 'organizer' ]
      }
    ]
  }
)