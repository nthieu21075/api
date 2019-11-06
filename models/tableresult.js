const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const TableResult = sequelizeDb.define('table_results', {
    win: {
        type: sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    lose: {
        type: sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    wp: {
        type: sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    point: {
        type: sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    tableId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    tournamentId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    tournamentTeamId: {
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

module.exports = TableResult