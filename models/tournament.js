const sequelize = require('sequelize')
const sequelizeDb = require('./sequelize')
const User = require('./user')
const Category = require('./category')

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
    mainImage: {
        type: sequelize.BLOB('long')
    },
    userId: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
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

User.hasMany(Tournament, { as: 'tournaments'})
Category.hasMany(Tournament, { as: 'tournaments' })
Tournament.belongsTo(User, {
  as: 'organizer',
  foreignKey: 'userId'
})

Tournament.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId'
})

module.exports = Tournament