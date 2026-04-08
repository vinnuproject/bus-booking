<template>
  <div id="app" class="app-shell">
    <SplashScreen v-if="showSplash" @finish="showSplash = false" />
    <header class="app-header">
      <div class="brand">BusBook</div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/search">Search</router-link>
        <router-link v-if="isAuthenticated" to="/history">History</router-link>
        <router-link v-if="isOperator" to="/operator">Operator</router-link>
      </nav>
      <div class="controls">
        <select v-model="locale.lang" aria-label="Language selector">
          <option value="en">EN</option>
          <option value="hi">HI</option>
        </select>
        <button v-if="isAuthenticated" @click="logout" class="ghost-btn">Logout</button>
        <div v-else class="auth-links">
          <router-link to="/login" class="ghost-btn">Login</router-link>
          <router-link to="/operator-login" class="ghost-btn">Operator</router-link>
        </div>
      </div>
    </header>
    <div class="app-content">
      <LoadingOverlay v-if="loading" />
      <router-view @loading="loading = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from './stores/auth.store';
import { locale } from './i18n';
import SplashScreen from './components/SplashScreen.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';

const showSplash = ref(true);
const loading = ref(false);
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated());
const isOperator = computed(() => auth.user?.role === 'operator');
const logout = async () => await auth.logout();
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 18%),
    radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.17), transparent 22%),
    linear-gradient(180deg, #edf2ff 0%, #f8fafc 100%);
  color: #0f172a;
  font-family: Inter, system-ui, sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 16px;
  margin: 16px;
  z-index: 20;
}

.brand {
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #ff6a00;
  text-transform: uppercase;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: #0f172a;
  text-decoration: none;
  font-weight: 700;
  padding: 10px 14px;
  border-radius: 14px;
  transition: background 0.2s ease, color 0.2s ease;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.72);
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 16px;
  padding: 10px 16px;
  color: #0f172a;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.auth-links {
  display: flex;
  gap: 10px;
}

.app-content {
  padding-top: 16px;
}
</style>
