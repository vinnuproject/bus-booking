<template>
  <section class="container page-grid">
    <div class="section-card auth-card">
      <div class="badge">Create account</div>
      <h1 class="page-title">Join BusBook</h1>
      <p>Register now to access verified traveler benefits and instant booking.</p>
      <div class="auth-header">
        <p>Create an account with crystal-clear booking flow, profile security, and instant travel savings.</p>
      </div>
      <div class="form-card">
        <label>Name</label>
        <input v-model="name" placeholder="Full name" />
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Email address" />
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Password" />
        <label>Gender</label>
        <select v-model="gender">
          <option value="Other">Other</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <label>Government ID</label>
        <input v-model="id_number" placeholder="Aadhaar / Passport" />
        <button class="primary-btn" :disabled="!name || !email || !password" @click="submitRegister">Register</button>
        <p class="muted">Already have an account? <router-link to="/login">Login</router-link></p>
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
const gender = ref('Other');
const id_number = ref('');

const submitRegister = async () => {
  await auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
    gender: gender.value,
    id_type: id_number.value ? 'Aadhaar/Passport' : null,
    id_number: id_number.value,
    preferred_language: 'en'
  });
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
