'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Pitches', 'ownerName', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Pitches', 'phoneNumber', {
                    type: Sequelize.INTEGER
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Pitches', 'phoneNumber', { transaction: t }),
                queryInterface.removeColumn('Pitches', 'ownerName', { transaction: t })
            ])
        })
    }
};
