const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const TeamMember = sequelizeDb.define('team_members', {
    teamId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    age: {
        type: sequelize.INTEGER
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

module.exports = TeamMember