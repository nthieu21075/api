const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const TournamentTeam = sequelizeDb.define('tournament_teams', {
    teamId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    tournamentId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize.ENUM,
        values: ['approved', 'canceled', 'pending']
    },
    createdAt: {
        type: sequelize.DATE
    },
    updatedAt: {
        type: sequelize.DATE
    }
}, {
    freezeTableName: true
})

module.exports = TournamentTeam