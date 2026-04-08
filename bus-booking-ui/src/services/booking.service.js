import api from './api';

export const fetchSeatMap = (busId, travel_date) => {
  return api.get(`/buses/${busId}/seats`, { params: { travel_date } });
};

export const holdSeat = payload => {
  return api.post('/bookings/hold', payload);
};

export const confirmBooking = payload => {
  return api.post('/bookings/confirm', payload);
};

export const fetchBookings = () => {
  return api.get('/bookings');
};

export const rescheduleBooking = payload => api.post('/bookings/reschedule', payload);
export const fetchCarbonSavings = bookingId => api.get(`/bookings/${bookingId}/carbon`);
export const tapNfc = payload => api.post('/boardings/nfc-tap', payload);
export const sendSos = payload => api.post('/sos', payload);
