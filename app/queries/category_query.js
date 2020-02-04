const { Category } = require('../../models/models')

exports.getAll = () => Category.findAll({ raw: true })

exports.findOrCreate = (fields, defaults) => Category.findOrCreate({ where: fields, defaults: defaults })

exports.getCategory = (id) => Category.findOne({ where: { id: id } })

exports.updateCategory = (id, fields) => Category.update(fields, { returning: true, where: { id: id } })

