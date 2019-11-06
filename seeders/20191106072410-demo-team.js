'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const teams = R.map((index) => ({
      name: 'Football Team of user ' + (index + 1),
      logo: '/seed/images/football.jpeg',
      userId: (index + 1),
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }), R.times(R.identity, 10))

    return queryInterface.bulkInsert('teams', teams, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('teams', null, {});
  }
};
