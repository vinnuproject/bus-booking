<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">RedBus Clone</div>
      <h1 class="page-title">Find your next bus journey</h1>
      <p>Search routes, compare buses, hold seats instantly, and checkout with confidence.</p>
      <div class="hero-panel">
        <div class="hero-card">
          <strong>Instant holds</strong>
          <span>Reserve your seat while you finish checkout.</span>
        </div>
        <div class="hero-card">
          <strong>Eco-friendly routes</strong>
          <span>Pick buses with EV and low-emission fleets.</span>
        </div>
        <div class="hero-card">
          <strong>Real-time updates</strong>
          <span>Live seat maps and bus telemetry for every trip.</span>
        </div>
      </div>
      <form @submit.prevent="searchRoutes" class="search-grid">
        <div>
          <label>From</label>
          <input v-model="origin" placeholder="e.g. Hyderabad" />
        </div>
        <div>
          <label>To</label>
          <input v-model="destination" placeholder="e.g. Bangalore" />
        </div>
        <div>
          <label>Travel date</label>
          <input type="date" v-model="travelDate" />
        </div>
        <button type="submit" class="primary-btn">Search buses</button>
      </form>
      <details class="filters-section">
        <summary>Advanced Filters</summary>
        <div class="filters-grid">
          <div>
            <label>Fuel Type</label>
            <select v-model="filters.fuel_type">
              <option value="">Any</option>
              <option value="EV">EV</option>
              <option value="Hydrogen">Hydrogen</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
          <div>
            <label>Seating Type</label>
            <select v-model="filters.seating_type">
              <option value="">Any</option>
              <option value="Seater">Seater</option>
              <option value="Semi-Sleeper">Semi-Sleeper</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </div>
          <div>
            <label><input type="checkbox" v-model="filters.has_wifi" /> WiFi</label>
          </div>
          <div>
            <label><input type="checkbox" v-model="filters.has_toilet" /> Toilet</label>
          </div>
          <div>
            <label><input type="checkbox" v-model="filters.has_charging" /> Charging</label>
          </div>
          <div>
            <label><input type="checkbox" v-model="filters.is_ac" /> AC</label>
          </div>
          <div>
            <label>Min Fare</label>
            <input type="number" v-model="filters.min_fare" placeholder="0" />
          </div>
          <div>
            <label>Max Fare</label>
            <input type="number" v-model="filters.max_fare" placeholder="10000" />
          </div>
        </div>
      </details>
      <div class="suggestions-panel" v-if="suggestions.length">
        <h3>Door-to-door route plan</h3>
        <ul>
          <li v-for="(leg, index) in suggestions" :key="index">
            <strong>{{ leg.mode }}:</strong> {{ leg.from }} → {{ leg.to }} <em>({{ leg.duration }})</em>
            <p>{{ leg.instruction }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="gradient-panel">
      <h2>Why book with us?</h2>
      <ul>
        <li>Live seat availability and instant holds.</li>
        <li>Clean, modern RedBus-style booking experience.</li>
        <li>Fast checkout and secure confirmations.</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useBooking } from '../composables/useBooking';
import { useRouter } from 'vue-router';
import { fetchRouteSuggestions } from '../services/route.service';

const { booking, setSearch } = useBooking();
const router = useRouter();

const origin = ref(booking.origin || 'Hyderabad');
const destination = ref(booking.destination || 'Bangalore');
const travelDate = ref(booking.travelDate || new Date().toISOString().slice(0, 10));
const suggestions = ref([]);
const filters = ref({
  fuel_type: '',
  seating_type: '',
  has_wifi: false,
  has_toilet: false,
  has_charging: false,
  is_ac: false,
  min_fare: '',
  max_fare: ''
});

const searchRoutes = () => {
  if (!origin.value || !destination.value) return;
  setSearch(origin.value, destination.value, travelDate.value, filters.value);
  router.push({ name: 'SearchResults' });
};

const loadSuggestions = async () => {
  try {
    const response = await fetchRouteSuggestions(origin.value, destination.value);
    suggestions.value = response.data.legs || [];
  } catch (error) {
    suggestions.value = [];
  }
};

loadSuggestions();
</script>

<style scoped>
.search-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: end;
}

.filters-section {
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.filters-section summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.filters-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin-top: 1rem;
}

.filters-grid label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.filters-grid input[type="checkbox"] {
  margin: 0;
}

.filters-grid select, .filters-grid input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-size: 0.95rem;
}

ul {
  list-style: disc;
  padding-left: 20px;
  color: #475569;
  margin: 1rem 0 0;
}

.hero-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin: 24px 0 16px;
}

.hero-card {
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.hero-card strong {
  display: block;
  font-size: 1.05rem;
  margin-bottom: 10px;
}

.hero-card span {
  color: #475569;
}

.suggestions-panel {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.suggestions-panel h3 {
  margin-top: 0;
}

.suggestions-panel li {
  margin-bottom: 1rem;
}
</style>
