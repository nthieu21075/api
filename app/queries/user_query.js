const { User } = require('../../models/models')

exports.findUserByEmail = (email) => User.findOne({ where: { email: email }, include: 'tournaments' })
exports.findUserById = (id) => User.findOne({ where: { id: id } })

exports.findOrCreate = (fields, defaults) => User.findOrCreate({ where: fields, defaults: defaults })

exports.updateUser = (id, fields) => User.update(fields, { returning: true, where: { id: id } })

exports.getOranziers = () => User.findAll({ where: { userType: 'organizer' } })
exports.getReferees = () => User.findAll({ where: { userType: 'referee' } })
