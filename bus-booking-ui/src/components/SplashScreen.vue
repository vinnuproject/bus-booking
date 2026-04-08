<template>
  <div class="splash-screen">
    <div class="splash-panel">
      <div class="logo-badge">redbus</div>
      <h1>Ride faster. Book smarter.</h1>
      <p>Search buses, hold seats instantly, and checkout in one smooth experience.</p>
      <div class="bus-animation">
        <AnimatedBus />
      </div>
      <button class="primary-btn" @click="finish">Start booking</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import AnimatedBus from './AnimatedBus.vue';
const emit = defineEmits(['finish']);
const finish = () => emit('finish');
</script>

<style scoped>
.splash-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, rgba(255, 61, 0, 0.16), transparent 32%),
    linear-gradient(180deg, #fff 0%, #f9fafb 100%);
  padding: 48px 16px;
}

.splash-panel {
  max-width: 720px;
  width: 100%;
  padding: 48px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.12);
  text-align: center;
  border: 1px solid rgba(255, 61, 0, 0.14);
}

.logo-badge {
  display: inline-flex;
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  background: #ff3d00;
  color: white;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 3.8vw, 4.5rem);
  color: #131313;
  line-height: 1.03;
}

p {
  margin: 1rem auto 2rem;
  max-width: 640px;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.8;
}

.bus-animation {
  margin: 2rem auto 3rem;
  width: min(320px, 100%);
}
</style>
