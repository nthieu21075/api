const Sequelize = require('sequelize')
const Op = Sequelize.Op
const R = require('ramda')
const { Tournament, TableResult, TournamentTeam, Table, Team } = require('../../models/models')

exports.getByfield = (fields) => Tournament.findAll({ where: fields, include: 'category', raw: true })

exports.create = (fields) => Tournament.create(fields)

exports.getById = (id) => Tournament.findOne({ where: { id: id }, include: ['category'], raw: true })

exports.updateTournament = (id, fields) => Tournament.update(fields, { returning: true, where: { id: id } })

exports.getTounamentTable = (tournamentId) => Table.findAll(
  { where:
    { tournamentId: tournamentId },
    include: [
      {
        model: TableResult,
        include: [
          {
            model: Team
          }
        ]
      }
    ],
    order: [
      [ 'name', 'ASC'],
      [ {model: TableResult}, 'point', 'ASC']
    ]
  }
)

exports.createTounamentTable = (arrFields) => Table.bulkCreate(arrFields)
exports.createTounamentTableResult = (arrFields) => TableResult.bulkCreate(arrFields)

exports.getTounamentTeam = (tournamentId, excludeTournamentTeamIds) => TournamentTeam.findAll(
  { where:
    {
      tournamentId: tournamentId,
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

exports.destroyAllTable = (tournamentId) => Table.destroy({
  where: {
    tournamentId: tournamentId
  }
})