const R = require('ramda')
const bcrypt = require('bcrypt')
const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Pitch = sequelizeDb.define('Pitches', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    address: {
        type: sequelize.STRING,
        allowNull: true
    },
    price: {
        type: sequelize.INTEGER,
        allowNull: true
    },
    location: {
        type: sequelize.ARRAY(sequelize.TEXT),
        defaultValue: []
    },
    mainImageUrl: {
        type: sequelize.STRING
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

module.exports = Pitch