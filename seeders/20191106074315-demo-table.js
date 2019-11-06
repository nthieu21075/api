'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tables = R.map((name) => ({
      name: name,
      tournamentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }), ['Table A', 'Table B', 'Table C', 'Table E'])

    return queryInterface.bulkInsert('tables', tables, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tables', null, {});
  }
}
