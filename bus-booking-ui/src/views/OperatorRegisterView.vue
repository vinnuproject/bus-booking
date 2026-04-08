<template>
  <section class="container page-grid">
    <div class="section-card auth-card">
      <div class="badge">Operator signup</div>
      <h1 class="page-title">Register as operator</h1>
      <p>Create an operator account to manage buses, boarding, and emergency support.</p>
      <div class="form-card">
        <label>Name</label>
        <input v-model="name" placeholder="Full name" />
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Work email" />
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Password" />
        <label>Operator ID</label>
        <input v-model="idNumber" placeholder="Operator ID or badge number" />
        <button class="primary-btn" :disabled="!name || !email || !password || !idNumber" @click="submitRegister">Register</button>
        <p class="error-message" v-if="error">{{ error }}</p>
        <p class="muted">Already have an operator account? <router-link to="/operator-login">Sign in</router-link></p>
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
const name = ref('');
const email = ref('');
const password = ref('');
const idNumber = ref('');
const error = ref('');

const submitRegister = async () => {
  error.value = '';
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: 'operator',
      gender: 'Other',
      id_type: 'Operator ID',
      id_number: idNumber.value,
      preferred_language: 'en'
    });
    router.push({ name: 'Operator' });
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed, please try again.';
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
