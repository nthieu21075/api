'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tournaments = R.map((index) => ({
      name: 'UEFA Champions League ' + index,
      shortDescription: 'The UEFA Champions League is an annual club football competition organised by the Union of European Football Associations',
      description: "Introduced in 1955 as the European Champion Clubs' Cup, more commonly known as the European Cup, it was initially a straight knockout tournament open only to the champion club of each national championship. The competition took on its current name in 1992, adding a round-robin group stage and allowing multiple entrants from certain countries.[1] It has since been expanded, and while most of Europe's national leagues can still only enter their champion, the strongest leagues now provide up to five teams.[2][3] Clubs that finish next-in-line in their national league, having not qualified for the Champions League, are eligible for the second-tier UEFA Europa League competition. (Beginning in 2021, UEFA will hold a third-tier competition called UEFA Europa Conference League, which will be composed of teams not eligible for the UEFA Europa League.[4])",
      team: 16,
      teamOfTable: 4,
      mainImageUrl: '/seed/images/football.jpeg',
      publish: false,
      userId: 11,
      categoryId: 1,
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }), R.times(R.identity, 10))

    return queryInterface.bulkInsert('tournaments', tournaments, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tournaments', null, {});
  }
};
