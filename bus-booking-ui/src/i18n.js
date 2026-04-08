import { reactive } from 'vue';

const messages = {
  en: {
    search: 'Search buses',
    origin: 'From',
    destination: 'To',
    travelDate: 'Travel date',
    advancedFilters: 'Advanced Filters',
    wifi: 'WiFi',
    toilet: 'Toilet',
    charging: 'Charging',
    ac: 'AC',
    minFare: 'Min Fare',
    maxFare: 'Max Fare',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    operatorPanel: 'Operator Panel'
  },
  hi: {
    search: 'बस खोजें',
    origin: 'से',
    destination: 'तक',
    travelDate: 'यात्रा तिथि',
    advancedFilters: 'उन्नत फ़िल्टर',
    wifi: 'वाई-फ़ाई',
    toilet: 'शौचालय',
    charging: 'चार्जिंग',
    ac: 'एसी',
    minFare: 'न्यूनतम किराया',
    maxFare: 'अधिकतम किराया',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    operatorPanel: 'ऑपरेटर पैनल'
  }
};

export const locale = reactive({ lang: 'en' });
export const t = (key) => messages[locale.lang]?.[key] || key;
