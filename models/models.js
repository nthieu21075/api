const Tournament = require('./tournament')
const User = require('./user')
const Category = require('./category')
const Table = require('./table')
const Team = require('./team')
const TournamentTeam = require('./tournament_teams')
const TableResult = require('./tableresult')

User.hasMany(Tournament, { as: 'tournaments' })
Category.hasMany(Tournament, { as: 'tournaments' })
Tournament.belongsTo(User, {
  as: 'organizer',
  foreignKey: 'userId'
})

Tournament.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId'
})

Tournament.hasMany(Table, { onDelete: 'CASCADE' })
Table.belongsTo(Tournament, { foreignKey: 'tournamentId' })

Tournament.hasMany(TableResult, { onDelete: 'CASCADE' })
TableResult.belongsTo(Tournament, { foreignKey: 'tournamentId' })

Tournament.hasMany(TournamentTeam, { onDelete: 'CASCADE' })
TournamentTeam.belongsTo(Tournament, { foreignKey: 'tournamentId' })
TournamentTeam.belongsTo(Team, { foreignKey: 'teamId' })

Table.hasMany(TableResult, { onDelete: 'CASCADE' })
TableResult.belongsTo(Table, { foreignKey: 'tableId' })
TableResult.belongsTo(Team, { through: TournamentTeam, foreignKey: 'tournamentTeamId' })

Team.belongsTo(User, {
  as: 'own',
  foreignKey: 'userId'
})

Team.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId'
})

module.exports = {
  Category,
  User,
  Tournament,
  Table,
  Team,
  TournamentTeam,
  TableResult
}