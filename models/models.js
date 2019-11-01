const Tournament = require('./tournament')
const User = require('./user')
const Category = require('./category')

User.hasMany(Tournament, { as: 'tournaments' })
Category.hasMany(Tournament, { as: 'tournaments' })
Tournament.belongsTo(User, {
  as: 'organizer',
  foreignKey: 'userId'
})

Tournament.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId'
})

module.exports = { Category, User, Tournament }