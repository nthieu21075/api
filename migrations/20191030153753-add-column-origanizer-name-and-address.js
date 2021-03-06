'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'location', { transaction: t }),
                queryInterface.addColumn('users', 'address', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('users', 'phoneNumber', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('users', 'organizerName', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('users', 'location', {
                    type: Sequelize.ARRAY(Sequelize.TEXT),
                    defaultValue: []
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'organizerName', { transaction: t }),
                queryInterface.removeColumn('users', 'address', { transaction: t }),
                queryInterface.removeColumn('users', 'phoneNumber', { transaction: t }),
                queryInterface.removeColumn('users', 'location', { transaction: t }),
                queryInterface.addColumn('users', 'location', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.removeIndex('users', ['email'], {
                  indexName: 'email_index',
                  indicesType: 'UNIQUE'
                }, { transaction: t }),
                queryInterface.removeIndex('users', ['organizerName'], {
                  indexName: 'organizerName_index',
                  indicesType: 'UNIQUE'
                }, { transaction: t })
            ])
        })
    }
};
