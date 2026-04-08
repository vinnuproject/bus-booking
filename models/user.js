'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Booking, { foreignKey: 'userId' });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.STRING,
    gender: DataTypes.ENUM('Male', 'Female', 'Other'),
    id_type: DataTypes.STRING,
    id_number: DataTypes.STRING,
    government_id_verified: DataTypes.BOOLEAN,
    preferred_language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  };

  return User;
};
