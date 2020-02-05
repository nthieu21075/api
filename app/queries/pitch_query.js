const { Pitch, Category } = require('../../models/models')

exports.findOrCreatePitch = (fields, defaults) => Pitch.findOrCreate({ where: fields, defaults: defaults })
exports.getPitch = (id) => Pitch.findOne({ where: { id: id } })
exports.updatePitch = (id, fields) => Pitch.update(fields, { returning: true, where: { id: id } })

exports.getPitchesByCategory = (categoryId) => Pitch.findAll({ where: { categoryId: categoryId } })

exports.getPitches = () => Pitch.findAll(
  {
    include: [
      {
        model: Category
      }
    ]
  }
)
