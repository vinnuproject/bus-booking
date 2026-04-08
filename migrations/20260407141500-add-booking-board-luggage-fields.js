'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'boarding_status', {
      type: Sequelize.ENUM('pending', 'boarded', 'missed'),
      defaultValue: 'pending'
    });
    await queryInterface.addColumn('Bookings', 'luggage_tag', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Bookings', 'luggage_status', {
      type: Sequelize.ENUM('pending', 'secured', 'delivered'),
      defaultValue: 'pending'
    });
    await queryInterface.addColumn('Bookings', 'nfc_boarded', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Bookings', 'boarding_status');
    await queryInterface.removeColumn('Bookings', 'luggage_tag');
    await queryInterface.removeColumn('Bookings', 'luggage_status');
    await queryInterface.removeColumn('Bookings', 'nfc_boarded');
  }
};
