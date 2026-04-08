'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    static associate(models) {
      Bus.belongsTo(models.Route, { foreignKey: 'routeId' });
      Bus.hasMany(models.Booking, { foreignKey: 'busId' });
    }
  }

  Bus.init({
    bus_number: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    routeId: DataTypes.INTEGER,
    fuel_type: DataTypes.ENUM('EV', 'Hydrogen', 'Diesel', 'CNG'),
    has_wifi: DataTypes.BOOLEAN,
    has_toilet: DataTypes.BOOLEAN,
    has_charging: DataTypes.BOOLEAN,
    is_ac: DataTypes.BOOLEAN,
    seating_type: DataTypes.ENUM('Sleeper', 'Semi-Sleeper', 'Seater'),
    operator_name: DataTypes.STRING,
    departure_time: DataTypes.TIME,
    arrival_time: DataTypes.TIME,
    fare: DataTypes.DECIMAL(10, 2),
    last_known_latitude: DataTypes.DECIMAL(10, 7),
    last_known_longitude: DataTypes.DECIMAL(10, 7),
    current_temperature: DataTypes.DECIMAL(4, 1),
    washroom_status: DataTypes.ENUM('Vacant', 'Occupied'),
    aqi: DataTypes.INTEGER,
    platform_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bus',
  });

  return Bus;
};
