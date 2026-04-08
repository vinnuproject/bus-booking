'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
      Route.hasMany(models.Bus, { foreignKey: 'routeId' });
      Route.hasMany(models.Booking, { foreignKey: 'routeId' });
    }
  }

  Route.init({
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    distance: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Route',
  });

  return Route;
};
