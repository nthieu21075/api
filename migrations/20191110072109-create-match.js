'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('matches', {
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
      name: {
        type: Sequelize.STRING
      },
      homeTournamentTeamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tournament_teams',
          key: 'id'
        }
      },
      visitorTournamentTeamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tournament_teams',
          key: 'id'
        }
      },
      refereeConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      userConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      homeScore: {
        type: Sequelize.INTEGER
      },
      visitorScore: {
        type: Sequelize.INTEGER
      },
      scheduled: {
        allowNull: false,
        type: Sequelize.DATE
      },
      rootIndex: {
        type: Sequelize.INTEGER
      },
      index: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('matches');
  }
};