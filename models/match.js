const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Match = sequelizeDb.define('matches', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    refereeConfirmed: {
        type: sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    userConfirmed: {
        type: sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    homeScore: {
        type: sequelize.INTEGER
    },
    visitorScore: {
        type: sequelize.INTEGER
    },
    tableId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    rootMatchId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    visitorTournamentTeamId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    homeTournamentTeamId: {
        type: sequelize.INTEGER,
        allowNull: false
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

module.exports = Match