const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Team = sequelizeDb.define('teams', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    logo: {
        type: sequelize.STRING
    },
    userId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    categoryId: {
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

module.exports = Team