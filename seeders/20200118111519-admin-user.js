'use strict';
const R = require('ramda')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const admins = [{
      name: 'John Doe Organizer',
      email: 'admin@admin.com',
      organizerName: 'John Doe Tournament',
      address: '123 testing 123 testing',
      phoneNumber: '+84111111111',
      userType: 'admin',
      password: '$2b$10$VpbTJk6hcF9kHOso5YDnHO22d0bwVwP5vzrmrhoz351no8PpZzuty',
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    return queryInterface.bulkInsert('users',admins, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
