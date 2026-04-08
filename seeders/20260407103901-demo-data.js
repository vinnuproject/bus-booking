'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword1 = bcrypt.hashSync('password1', 10);
    const hashedPassword2 = bcrypt.hashSync('password2', 10);
    const hashedOperatorPassword = bcrypt.hashSync('operatorpass', 10);

    // Insert Users
    await queryInterface.bulkInsert('Users', [
      { name: 'Alice', email: 'alice@example.com', password_hash: hashedPassword1, phone: '1234567890', role: 'customer', gender: 'Female', id_type: 'Aadhaar', id_number: '9999-8888-7777', government_id_verified: true, preferred_language: 'en', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bob', email: 'bob@example.com', password_hash: hashedPassword2, phone: '9876543210', role: 'customer', gender: 'Male', id_type: 'Passport', id_number: 'X1234567', government_id_verified: true, preferred_language: 'en', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daksh', email: 'operator@example.com', password_hash: hashedOperatorPassword, phone: '1112223333', role: 'operator', gender: 'Male', id_type: 'Operator ID', id_number: 'OP-001', government_id_verified: true, preferred_language: 'en', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Insert Routes
    await queryInterface.bulkInsert('Routes', [
      { source: 'Hyderabad', destination: 'Bangalore', distance: 600, createdAt: new Date(), updatedAt: new Date() },
      { source: 'Delhi', destination: 'Agra', distance: 200, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Insert Buses
    await queryInterface.bulkInsert('Buses', [
      { bus_number: 'BUS101', capacity: 40, routeId: 1, fuel_type: 'EV', has_wifi: true, has_toilet: true, has_charging: true, is_ac: true, seating_type: 'Semi-Sleeper', operator_name: 'GreenBus', departure_time: '08:00:00', arrival_time: '14:00:00', fare: 500.00, last_known_latitude: 17.3850, last_known_longitude: 78.4867, current_temperature: 22.5, washroom_status: 'Vacant', aqi: 18, platform_number: 'B4', createdAt: new Date(), updatedAt: new Date() },
      { bus_number: 'BUS202', capacity: 50, routeId: 2, fuel_type: 'Diesel', has_wifi: false, has_toilet: false, has_charging: false, is_ac: false, seating_type: 'Seater', operator_name: 'CheapTravel', departure_time: '06:00:00', arrival_time: '08:00:00', fare: 200.00, last_known_latitude: 28.6139, last_known_longitude: 77.2090, current_temperature: 25.0, washroom_status: 'Occupied', aqi: 34, platform_number: 'C1', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Insert Bookings
    await queryInterface.bulkInsert('Bookings', [
      { userId: 1, busId: 1, routeId: 1, travel_date: new Date('2026-04-10'), createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, busId: 2, routeId: 2, travel_date: new Date('2026-04-12'), createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Routes', null, {});
    await queryInterface.bulkDelete('Buses', null, {});
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
