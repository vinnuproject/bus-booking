import api from './api';

export const register = payload => api.post('/auth/register', payload);
export const login = payload => api.post('/auth/login', payload);
export const logout = refreshToken => api.post('/auth/logout', { refreshToken });

export const saveAuthTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
