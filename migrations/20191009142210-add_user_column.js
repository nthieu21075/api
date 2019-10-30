'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('users', 'location', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('users', 'userType', {
                    type: Sequelize.ENUM,
                    values: [
                        'normal',
                        'referee',
                        'organizer',
                        'admin',
                    ],
                    defaultValue: 'normal'
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'location', { transaction: t }),
                queryInterface.removeColumn('users', 'userType', { transaction: t })
            ])
        })
    }
};