<template>
  <section class="container page-grid">
    <div class="section-card auth-card">
      <div class="badge">Operator access</div>
      <h1 class="page-title">Operator sign in</h1>
      <p>Sign in with your operator credentials to manage boarding, SOS, and manifests.</p>
      <div class="form-card">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Operator email" />
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Password" />
        <button class="primary-btn" :disabled="!email || !password" @click="submitLogin">Sign in</button>
        <p class="error-message" v-if="error">{{ error }}</p>
        <p class="muted">Need an operator account? <router-link to="/operator-register">Register here</router-link></p>
        <p class="muted">If you are a regular customer, <router-link to="/login">use the normal login page</router-link>.</p>
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
const error = ref('');

const submitLogin = async () => {
  error.value = '';
  try {
    await auth.login({ email: email.value, password: password.value });
    if (auth.user?.role !== 'operator') {
      await auth.logout();
      error.value = 'Operator credentials required. Please use the regular login page.';
      return;
    }
    router.push({ name: 'Operator' });
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed, please verify your credentials.';
  }
};
</script>

<style scoped>
.auth-card {
  max-width: 560px;
  margin: 0 auto;
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

.error-message {
  color: #b91c1c;
}

.muted {
  color: #64748b;
  margin-top: 12px;
}
</style>
