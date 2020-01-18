'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pitches', [{
      name: 'Pitches 1',
      mainImageUrl: '/seed/images/football.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Pitches 2',
      mainImageUrl: '/seed/images/league_of_legend.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Pitches 3',
      mainImageUrl: '/seed/images/coming_soon.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pitches', null, {});
  }
};
