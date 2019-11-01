const { Category } = require('../../models/models')

exports.getAll = () => Category.findAll({ raw: true })

exports.findOrCreate = (fields, defaults) => Category.findOrCreate({ where: fields, defaults: defaults })