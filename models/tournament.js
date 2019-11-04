const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Tournament = sequelizeDb.define('tournaments', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    shortDescription: {
        type: sequelize.STRING
    },
    description: {
        type: sequelize.STRING
    },
    team: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    mainImageUrl: {
        type: sequelize.STRING
    },
    userId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    publish: {
        type: sequelize.BOOLEAN,
        defaultValue: false
    },
    categoryId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    startDate: {
        type: sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: sequelize.DATE,
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

module.exports = Tournament