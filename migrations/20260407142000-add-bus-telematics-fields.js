'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Buses', 'last_known_latitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'last_known_longitude', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'current_temperature', {
      type: Sequelize.DECIMAL(4, 1),
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'washroom_status', {
      type: Sequelize.ENUM('Vacant', 'Occupied'),
      defaultValue: 'Vacant'
    });
    await queryInterface.addColumn('Buses', 'aqi', {
      type: Sequelize.INTEGER,
      defaultValue: 25
    });
    await queryInterface.addColumn('Buses', 'platform_number', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Buses', 'last_known_latitude');
    await queryInterface.removeColumn('Buses', 'last_known_longitude');
    await queryInterface.removeColumn('Buses', 'current_temperature');
    await queryInterface.removeColumn('Buses', 'washroom_status');
    await queryInterface.removeColumn('Buses', 'aqi');
    await queryInterface.removeColumn('Buses', 'platform_number');
  }
};
