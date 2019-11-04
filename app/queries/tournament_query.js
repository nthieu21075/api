const { Tournament } = require('../../models/models')

exports.getByfield = (fields) => Tournament.findAll({ where: fields, include: 'category', raw: true })

exports.create = (fields) => Tournament.create(fields)

exports.getById = (id) => Tournament.findOne({ where: { id: id }, include: 'category', raw: true })

exports.updateTournament = (id, fields) => Tournament.update(fields, { returning: true, where: { id: id } })