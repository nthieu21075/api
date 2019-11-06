'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [{
      name: 'Football',
      imageUrl: '/seed/images/football.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'League of Legend',
      imageUrl: '/seed/images/league_of_legend.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Dota',
      imageUrl: '/seed/images/coming_soon.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Volleyball',
      imageUrl: '/seed/images/coming_soon.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Basketball',
      imageUrl: '/seed/images/coming_soon.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Dota2',
      imageUrl: '/seed/images/coming_soon.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  }
};
