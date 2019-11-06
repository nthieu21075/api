'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const data = R.map((index) => ({
      teamId: index + 1,
      tournamentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }), R.times(R.identity, 10))

    return queryInterface.bulkInsert('tournament_teams', data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tournament_teams', null, {});
  }
}
