'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('tournament_teams', 'status', {
                    type: Sequelize.ENUM,
                    values: [
                        'approved',
                        'canceled',
                        'pending'
                    ],
                    defaultValue: 'pending'
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('tournament_teams', 'status', { transaction: t })
            ])
        })
    }
};
