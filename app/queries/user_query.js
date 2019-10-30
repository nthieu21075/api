const User = require('../../models/user')

exports.findUserByEmail = (email) => User.findOne({ where: { email: email } })
exports.findUserById = (id) => User.findOne({ where: { id: id } })

exports.findOrCreate = (fields, defaults) => User.findOrCreate({ where: fields, defaults: defaults })

exports.updateUser = (id, fields) => User.update(fields, { returning: true, where: { id: id } })