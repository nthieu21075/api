const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Manual = sequelizeDb.define('manuals', {
    originalName: {
        type: sequelize.STRING,
        allowNull: false
    },
    path: {
        type: sequelize.STRING,
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

module.exports = Manual