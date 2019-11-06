const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Table = sequelizeDb.define('tables', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    tournamentId: {
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

module.exports = Table