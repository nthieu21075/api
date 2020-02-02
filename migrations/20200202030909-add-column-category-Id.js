'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('users', 'categoryId', {
                    type: Sequelize.INTEGER
                }, { transaction: t }),
                queryInterface.addColumn('Pitches', 'categoryId', {
                    type: Sequelize.INTEGER
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'categoryId', { transaction: t }),
                queryInterface.removeColumn('Pitches', 'categoryId', { transaction: t })
            ])
        })
    }
};
