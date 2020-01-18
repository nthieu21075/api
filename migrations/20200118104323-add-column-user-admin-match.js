'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('users', 'price', {
                    type: Sequelize.INTEGER
                }, { transaction: t }),
                queryInterface.addColumn('matches', 'userId', {
                    type: Sequelize.INTEGER
                }, { transaction: t }),
                queryInterface.addColumn('matches', 'pitchId', {
                    type: Sequelize.INTEGER
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'price', { transaction: t }),
                queryInterface.removeColumn('matches', 'userId', { transaction: t }),
                queryInterface.removeColumn('matches', 'pitchId', { transaction: t })
            ])
        })
    }
};
