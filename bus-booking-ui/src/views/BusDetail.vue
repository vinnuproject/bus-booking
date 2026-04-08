<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">Select seat</div>
      <h1 class="page-title">{{ routeTitle }}</h1>
      <p>Hold a seat for 10 minutes before confirming payment.</p>
      <div class="bus-detail-grid">
        <div>
          <p class="label">Bus</p>
          <h2>{{ bus?.bus_number || 'Bus detail' }}</h2>
          <p class="muted">Capacity: {{ bus?.capacity || 0 }} seats</p>
          <p class="muted">Travel date: {{ travelDate }}</p>
          <div class="detail-tags">
            <span>Eco-friendly</span>
            <span>Fast boarding</span>
            <span>Premium comfort</span>
          </div>
        </div>
        <div class="actions">
          <button class="primary-btn animated-btn" :disabled="!selectedSeat" @click="submitHold">Hold selected seat</button>
          <p class="muted">Selected Seat: {{ selectedSeat || 'None' }}</p>
        </div>
      </div>
      <div class="telematics-card" v-if="busTelemetry">
        <h2>Digital twin & live telematics</h2>
        <div class="telematics-grid">
          <div>
            <p class="label">Cabin temperature</p>
            <strong>{{ busTelemetry.current_temperature }}°C</strong>
          </div>
          <div>
            <p class="label">Washroom status</p>
            <strong>{{ busTelemetry.washroom_status }}</strong>
          </div>
          <div>
            <p class="label">HEPA AQI</p>
            <strong>{{ busTelemetry.aqi }}</strong>
          </div>
          <div>
            <p class="label">Platform</p>
            <strong>{{ busTelemetry.platform_number }}</strong>
          </div>
        </div>
        <div class="interior-preview">
          <p class="label">360° interior preview</p>
          <div class="preview-box">Premium cabin view with USB-C outlets, privacy pods, and adjustable seat recline.</div>
        </div>
        <div class="map-panel">
          <p class="label">Live bus location</p>
          <div class="map-shell">
            <div class="bus-marker"></div>
            <span class="map-text">Lat: {{ busTelemetry.last_known_latitude }}, Lon: {{ busTelemetry.last_known_longitude }}</span>
          </div>
        </div>
      </div>
      <SeatMap :seats="seatMap" :selectedSeat="selectedSeat" @select="holdSeatHandler" />
      <div class="seat-note">
        Click an available seat to reserve it. Held seats turn orange, confirmed seats turn red.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '../composables/useBooking';
import { useAuthStore } from '../stores/auth.store';
import { fetchSeatMap, holdSeat as holdSeatRequest } from '../services/booking.service';
import { fetchBusTelemetry } from '../services/route.service';
import SeatMap from '../components/SeatMap.vue';
import socket from '../services/socket.js';

const { booking } = useBooking();
const auth = useAuthStore();
const router = useRouter();
const seatMap = ref([]);
const selectedSeat = ref(booking.seatHold?.seat_number || '');
const busTelemetry = ref(null);
const bus = computed(() => booking.selectedBus);
const travelDate = computed(() => booking.travelDate);
const routeTitle = computed(() => booking.routeInfo ? `${booking.routeInfo.source} → ${booking.routeInfo.destination}` : 'Trip details');

const loadSeats = async () => {
  if (!bus.value) return router.push({ name: 'SearchResults' });
  const response = await fetchSeatMap(bus.value.id, travelDate.value);
  seatMap.value = response.data.seats || [];
};

const loadTelemetry = async () => {
  if (!bus.value) return;
  const response = await fetchBusTelemetry(bus.value.id);
  busTelemetry.value = response.data;
};

const holdSeatHandler = selected => {
  if (selected.status !== 'available') return;
  selectedSeat.value = selected.seat_number;
};

const submitHold = async () => {
  if (!selectedSeat.value || !bus.value) {
    return;
  }
  if (!auth.isAuthenticated()) {
    router.push({ name: 'Login' });
    return;
  }
  const response = await holdSeatRequest({
    userId: auth.user.id,
    busId: bus.value.id,
    routeId: booking.selectedRoute?.id ?? bus.value.routeId,
    travel_date: travelDate.value,
    seat_number: selectedSeat.value,
    total_price: (Math.floor(bus.value.capacity * 15) + 499).toFixed(2)
  });
  booking.seatHold = response.data;
  booking.advance();
  router.push({ name: 'Checkout' });
};

onMounted(() => {
  loadSeats();
  loadTelemetry();
  socket.on('seatUpdate', (data) => {
    if (data.busId === bus.value.id && data.travel_date === travelDate.value) {
      seatMap.value = data.seatMap;
    }
  });
});

onUnmounted(() => {
  socket.off('seatUpdate');
});
</script>

<style scoped>
.bus-detail-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1.5fr 1fr;
  margin: 28px 0;
}

.label {
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.muted {
  color: #64748b;
}

.telematics-card {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.detail-tags span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  color: #0f172a;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.86);
}

.telematics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
}

.preview-box {
  min-height: 120px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.08));
  display: grid;
  place-items: center;
  color: #1e293b;
  text-align: center;
  padding: 16px;
}

.map-panel {
  margin-top: 18px;
}

.map-shell {
  position: relative;
  min-height: 140px;
  border-radius: 24px;
  background: linear-gradient(180deg, #e2e8f0 0%, #f8fafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bus-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff3d00;
  box-shadow: 0 0 0 10px rgba(255, 61, 0, 0.12);
}

.map-text {
  position: absolute;
  bottom: 14px;
  font-size: 0.95rem;
  color: #475569;
}

.seat-note {
  color: #475569;
  margin-top: 20px;
}
</style>
