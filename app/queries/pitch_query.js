const { Pitch, Category } = require('../../models/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.findOrCreatePitch = (fields, defaults) => Pitch.findOrCreate({ where: fields, defaults: defaults })
exports.getPitch = (id) => Pitch.findOne({ where: { id: id } })
exports.updatePitch = (whereFields, fields) => Pitch.update(fields, { returning: true, where: whereFields })

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

exports.deletePitch = (id) => Pitch.destroy({
  where: {
    id: id
  }
})
