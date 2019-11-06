'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('table_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tables',
          key: 'id'
        }
      },
      tournamentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tournaments',
          key: 'id'
        }
      },
      tournamentTeamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tournament_teams',
          key: 'id'
        }
      },
      win: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      lose: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      wp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      point: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('table_results');
  }
};