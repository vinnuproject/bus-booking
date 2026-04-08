import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/auth.service';
import { saveAuthTokens, clearAuthTokens } from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('accessToken') || null);

  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const setToken = (tokenValue) => {
    token.value = tokenValue;
    if (tokenValue) {
      localStorage.setItem('accessToken', tokenValue);
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    setUser(response.data.user);
    saveAuthTokens(response.data);
    setToken(response.data.accessToken);
    return response;
  };

  const register = async (payload) => {
    const response = await apiRegister(payload);
    setUser(response.data.user);
    saveAuthTokens(response.data);
    setToken(response.data.accessToken);
    return response;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await apiLogout(refreshToken).catch(() => {});
    clearAuthTokens();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => !!user.value && !!token.value;

  return {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated
  };
});
