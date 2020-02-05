const { User, Category } = require('../../models/models')

exports.findUserByEmail = (email) => User.findOne({ where: { email: email }, include: 'tournaments' })
exports.findUserById = (id) => User.findOne({ where: { id: id } })

exports.findOrCreate = (fields, defaults) => User.findOrCreate({ where: fields, defaults: defaults })

exports.updateUser = (id, fields) => User.update(fields, { returning: true, where: { id: id } })

exports.getOranziers = () => User.findAll({ where: { userType: 'organizer' } })

exports.getOrganzier = (id) => User.findOne({ where: { id: id, userType: 'organizer' } })
exports.getReferee = (id) => User.findOne({ where: { id: id, userType: 'referee' } })

exports.updateOrganzier = (id, fields) => User.update(fields, { returning: true, where: { id: id, userType: 'organizer' } })

exports.updateReferee = (id, fields) => User.update(fields, { returning: true, where: { id: id, userType: 'referee' } })

exports.getRefereesByCategory = (categoryId) => User.findAll({ where: { categoryId: categoryId, userType: 'referee' } })

exports.getReferees = () => User.findAll(
  {
    where: { userType: 'referee' },
    include: [
      {
        model: Category
      }
    ]
  }
)
