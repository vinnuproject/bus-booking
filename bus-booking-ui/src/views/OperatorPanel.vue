<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">Operator panel</div>
      <h1 class="page-title">Manifest & Route control</h1>
      <p>Monitor boarding status, route checkpoints, and bus manifest in real time.</p>
      <div class="operator-summary-grid">
        <div class="summary-card">
          <p>Total manifest</p>
          <h3>{{ manifest.length || 0 }}</h3>
        </div>
        <div class="summary-card">
          <p>Current checkpoint</p>
          <h3>{{ status?.checkpoint || 'Pending' }}</h3>
        </div>
        <div class="summary-card">
          <p>ETA</p>
          <h3>{{ status?.eta || 'Unknown' }}</h3>
        </div>
      </div>
      <div class="operator-grid">
        <div class="form-card">
          <label>Bus ID</label>
          <input v-model="busId" placeholder="Bus ID" />
          <label>Travel date</label>
          <input type="date" v-model="travelDate" />
          <button class="primary-btn" @click="loadManifest">Load manifest</button>
        </div>
        <div class="form-card">
          <label>Checkpoint</label>
          <input v-model="checkpoint" placeholder="Rest stop or city checkpoint" />
          <button class="primary-btn" @click="submitCheckpoint">Check in checkpoint</button>
          <div v-if="status" class="status-box">
            <p><strong>Status</strong>: {{ status.status }}</p>
            <p><strong>ETA</strong>: {{ status.eta }}</p>
            <p><strong>Checkpoint</strong>: {{ status.checkpoint }}</p>
          </div>
        </div>
      </div>
      <div v-if="manifest.length" class="manifest-card">
        <h2>Passenger manifest</h2>
        <div v-for="entry in manifest" :key="entry.id" class="manifest-row">
          <strong>{{ entry.User.name }}</strong>
          <span>{{ entry.User.gender }} / {{ entry.User.id_type }} / {{ entry.User.id_number }}</span>
          <span>Seat {{ entry.seat_number }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import axios from '../services/api';

const auth = useAuthStore();
const router = useRouter();
const busId = ref('1');
const travelDate = ref(new Date().toISOString().slice(0, 10));
const checkpoint = ref('Rest stop 1');
const manifest = ref([]);
const status = ref(null);

onMounted(() => {
  if (!auth.isAuthenticated() || auth.user.role !== 'operator') {
    router.push({ name: 'Login' });
  }
});

const loadManifest = async () => {
  const response = await axios.get('/operators/manifest', { params: { busId: busId.value, travel_date: travelDate.value } });
  manifest.value = response.data.manifest || [];
};

const submitCheckpoint = async () => {
  const response = await axios.post('/operators/checkpoint', {
    busId: busId.value,
    travel_date: travelDate.value,
    checkpoint: checkpoint.value
  });
  status.value = response.data.status;
};
</script>

<style scoped>
.operator-summary-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-top: 24px;
}

.summary-card {
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.summary-card p {
  margin: 0;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}

.summary-card h3 {
  margin: 12px 0 0;
  font-size: 2rem;
  color: #0f172a;
}

.operator-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: 24px;
}

.form-card,
.manifest-card {
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.status-box {
  margin-top: 16px;
  padding: 18px;
  background: rgba(255, 237, 213, 0.45);
  border-radius: 16px;
}

.manifest-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}
</style>
