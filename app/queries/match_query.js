const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const R = require('ramda')
const { Match, Tournament, Table, TournamentTeam, TableResult } = require('../../models/models')

exports.create = (fields) => Match.bulkCreate(fields)

exports.getMatchs = (fields) => Match.findAll({ where: fields })
exports.getMatch = (id) => Match.findOne({ where: {id: id}})

exports.getRefereeTournament = (id, fields) => Tournament.findAll({
  where: fields,
  include: [
    'organizer',
    {
      model: Table,
      include: [
        {
          model: Match,
          where: {
            userId: id
          },
          include: [ 'homeTeam', 'visitorTeam', 'pitch', 'referee' ]
        }
      ]
    }
  ]
})

exports.getRefereeMatch = (fields) => Match.findAll({
  where: fields,
  include: [
    {
      model: Table
    }
  ]
})

exports.getNextMatch = (fields) => Match.findOne({ where: fields})

exports.getTableId = (tournamentId) => R.pluck('id')(Table.findAll({ where: { tournamentId: tournamentId }, raw: true }))

exports.getTableResult = (tableId, tournamentTeamId, tournamentId) => TableResult.findOne({ where: { tableId: tableId, tournamentTeamId: tournamentTeamId, tournamentId: tournamentId } })

exports.updateTableResult = (whereFields, updatefields) => TableResult.update(updatefields, { returning: true, where: whereFields })

exports.updateMatchIndex = (whereFields, updatefields) => Match.update(updatefields, { returning: true, where: whereFields })

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
          include: [ 'homeTeam', 'visitorTeam', 'pitch', 'referee' ],
          order: ['index', 'ASC']
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
            },
            [Op.and]: [
              {
                scheduled: {[Op.gt]: moment().startOf('day') }
              },
              {
                scheduled: {[Op.lt]: moment().endOf('day') }
              }
            ]
          },
          include: [ 'homeTeam', 'visitorTeam', 'pitch', 'referee' ]
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

exports.updateMatch = (id, fields) => Match.update(fields, { returning: true, where: { id: id } })
