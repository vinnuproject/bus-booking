<template>
  <section class="container page-grid">
    <div class="section-card auth-card">
      <div class="badge">Secure login</div>
      <h1 class="page-title">Welcome back</h1>
      <p>Sign in to unlock real-time bookings and special offers.</p>
      <div class="auth-header">
        <p>Glassmorphism UI with secure session, fast booking access, and seat hold flow.</p>
      </div>
      <div class="form-card">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Email address" />
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Password" />
        <button class="primary-btn" :disabled="!email || !password" @click="submitLogin">Login</button>
        <p class="muted">New here? <router-link to="/register">Create an account</router-link></p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const auth = useAuthStore();
const email = ref('');
const password = ref('');

const submitLogin = async () => {
  await auth.login({ email: email.value, password: password.value });
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.auth-card {
  max-width: 580px;
  margin: 0 auto;
  position: relative;
}

.auth-header {
  margin-top: 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  color: #334155;
}

.form-card {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

label {
  color: #475569;
  font-size: 0.95rem;
  display: block;
}

.muted {
  color: #64748b;
  margin-top: 12px;
}
</style>
