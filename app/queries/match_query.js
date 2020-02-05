const Sequelize = require('sequelize')
const Op = Sequelize.Op
const R = require('ramda')
const { Match, Tournament, Table, TournamentTeam } = require('../../models/models')

exports.create = (fields) => Match.bulkCreate(fields)

exports.getTableId = (tournamentId) => R.pluck('id')(Table.findAll({ where: { tournamentId: tournamentId }, raw: true }))

exports.destroyAllMatch = (tableIds) => Match.destroy({
  where: {
    tableId: {
      [Op.in]: tableIds
    }
  }
})

exports.getMatchOfTournament = (tournamentId) => Tournament.findOne({
  where: { id: tournamentId },
  include: [
    {
      model: Table,
      include: [
        {
          model: Match,
          include: [ 'homeTeam', 'visitorTeam', 'pitch', 'referee' ]
        }
      ]
    }
  ]
})

exports.getHappeningMatch = (fields) => Tournament.findAll({
  where: fields,
  include: [
    {
      model: Table,
      include: [
        {
          model: Match,
          where: {
            homeTournamentTeamId: {
              [Op.ne]: null
            },
            visitorTournamentTeamId: {
              [Op.ne]: null
            }
          },
          include: [ 'homeTeam', 'visitorTeam' ]
        }
      ]
    }
  ]
})

exports.removeTeamOutOfMatch = (tournamentIds) => Match.update({
  visitorTournamentTeamId: null,
  homeTournamentTeamId: null
},{
  where: {
    [Op.or]: [
      {
        visitorTournamentTeamId: {
          [Op.in]: tournamentIds
        }
      },
      {
        homeTournamentTeamId: {
          [Op.in]: tournamentIds
        }
      }
    ]
  },
  raw: true
})