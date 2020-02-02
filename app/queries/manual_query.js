const { Manual } = require('../../models/models')

exports.createManual = (fields) => Manual.bulkCreate(fields)

exports.getManual = () => Manual.findAll()

exports.destroyManual = (id) => Manual.destroy({
  where: {
    id: id
  }
})