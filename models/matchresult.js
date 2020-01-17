const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const MatchResult = sequelizeDb.define('match_results', {
    result: {
        type: sequelize.STRING,
        allowNull: false
    },
    matchId: {
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

module.exports = MatchResult