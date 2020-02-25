const { Category } = require('../../models/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.getAll = () => Category.findAll({ where: {
    [Op.and]: [
      {
        hidden: {
          [Op.ne]: true
        }
      },
      {
        hidden: {
          [Op.ne]: null
        }
      }
    ]
  },
  raw: true
})

exports.findOrCreate = (fields, defaults) => Category.findOrCreate({ where: fields, defaults: defaults })

exports.getCategory = (id) => Category.findOne({
  where: {
    id: id,
    [Op.and]: [
      {
        hidden: {
          [Op.ne]: true
        }
      },
      {
        hidden: {
          [Op.ne]: null
        }
      }
    ]
  }
})

exports.updateCategory = (id, fields) => Category.update(fields, { returning: true, where: { id: id } })

exports.deleteCategory = (id) => Category.update({ hidden: true }, { returning: true, where: { id: id } })
