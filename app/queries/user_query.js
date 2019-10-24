const User = require('../../models/user')

exports.findUserByEmail = (email) => User.findOne({ where: { email: email } })

exports.findOrCreate = (fields, defaults) => User.findOrCreate({ where: fields, defaults: defaults })