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
          include: [
            {
              model: TournamentTeam
            }
          ]
        }
      ]
    }
  ]
})