import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered: ', registration);
    })
    .catch(error => {
      console.log('SW registration failed: ', error);
    });
}
