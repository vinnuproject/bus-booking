'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Bus, { foreignKey: 'busId' });
      Booking.belongsTo(models.Route, { foreignKey: 'routeId' });
    }
  }

  Booking.init({
    userId: DataTypes.INTEGER,
    busId: DataTypes.INTEGER,
    routeId: DataTypes.INTEGER,
    travel_date: DataTypes.DATE,
    seat_number: DataTypes.STRING,
    status: DataTypes.STRING,
    held_until: DataTypes.DATE,
    total_price: DataTypes.DECIMAL(10, 2),
    boarding_status: DataTypes.ENUM('pending', 'boarded', 'missed'),
    luggage_tag: DataTypes.STRING,
    luggage_status: DataTypes.ENUM('pending', 'secured', 'delivered'),
    nfc_boarded: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
