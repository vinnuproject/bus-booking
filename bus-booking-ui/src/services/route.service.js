import api from './api';

export const fetchRoutes = () => api.get('/routes');
export const fetchBuses = () => api.get('/buses');
export const searchRoutes = (origin, destination, filters = {}) => api.get('/routes/search', { params: { origin, destination, ...filters } });
export const fetchRouteSuggestions = (origin, destination) => api.get('/routes/suggestions', { params: { origin, destination } });
export const fetchBus = id => api.get(`/buses/${id}`);
export const fetchBusTelemetry = id => api.get(`/buses/${id}/telemetry`);
