const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')

const Category = sequelizeDb.define('categories', {
    name: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false
    },
    image: {
        type: sequelize.BLOB('long'),
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

module.exports = Category