'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Buses', 'fuel_type', {
      type: Sequelize.ENUM('EV', 'Hydrogen', 'Diesel', 'CNG'),
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'has_wifi', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Buses', 'has_toilet', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Buses', 'has_charging', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Buses', 'is_ac', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Buses', 'seating_type', {
      type: Sequelize.ENUM('Sleeper', 'Semi-Sleeper', 'Seater'),
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'operator_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'departure_time', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'arrival_time', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Buses', 'fare', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Buses', 'fuel_type');
    await queryInterface.removeColumn('Buses', 'has_wifi');
    await queryInterface.removeColumn('Buses', 'has_toilet');
    await queryInterface.removeColumn('Buses', 'has_charging');
    await queryInterface.removeColumn('Buses', 'is_ac');
    await queryInterface.removeColumn('Buses', 'seating_type');
    await queryInterface.removeColumn('Buses', 'operator_name');
    await queryInterface.removeColumn('Buses', 'departure_time');
    await queryInterface.removeColumn('Buses', 'arrival_time');
    await queryInterface.removeColumn('Buses', 'fare');
  }
};
