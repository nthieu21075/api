const { Pitch, Category } = require('../../models/models')

exports.findOrCreatePitch = (fields, defaults) => Pitch.findOrCreate({ where: fields, defaults: defaults })

exports.getPitches = () => Pitch.findAll(
  {
    include: [
      {
        model: Category
      }
    ]
  }
)
