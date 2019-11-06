'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const normalUsers = R.map((index) => ({
      name: 'Normal User ' + index,
      email: 'b' + index + '@b.com',
      address: '123 testing 123 testing',
      phoneNumber: '+84111111111',
      password: '$2b$10$VpbTJk6hcF9kHOso5YDnHO22d0bwVwP5vzrmrhoz351no8PpZzuty',
      userType: 'normal',
      createdAt: new Date(),
      updatedAt: new Date()
    }), R.times(R.identity, 10))

    const organiers = [{
      name: 'John Doe Organizer',
      email: 'a@a.com',
      organizerName: 'John Doe Tournament',
      address: '123 testing 123 testing',
      phoneNumber: '+84111111111',
      userType: 'organizer',
      password: '$2b$10$VpbTJk6hcF9kHOso5YDnHO22d0bwVwP5vzrmrhoz351no8PpZzuty',
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    return queryInterface.bulkInsert('users', R.concat(normalUsers, organiers), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
