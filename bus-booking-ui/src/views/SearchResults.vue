<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">Available buses</div>
      <h1 class="page-title">Routes matching your search</h1>
      <p>Click on a bus to view seats and lock your preferred seat instantly.</p>
      <div v-if="loading" class="empty-state">
        <p>Searching for buses...</p>
      </div>
      <div v-else-if="matchedBuses.length" class="results-list">
        <BusCard
          v-for="bus in matchedBuses"
          :key="bus.id"
          :bus="bus"
          :route="selectedRoute"
          :travelDate="travelDate"
          @select="openBus"
        />
      </div>
      <div v-else class="empty-state">
        <p>{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '../composables/useBooking';
import { searchRoutes } from '../services/route.service';
import BusCard from '../components/BusCard.vue';

const router = useRouter();
const { booking } = useBooking();
const matchedBuses = ref([]);
const selectedRoute = ref(null);
const travelDate = ref(booking.travelDate);
const loading = ref(false);
const message = ref('Searching for buses...');

const loadResults = async () => {
  if (!booking.origin || !booking.destination) {
    router.push({ name: 'Home' });
    return;
  }

  loading.value = true;
  try {
    const response = await searchRoutes(booking.origin, booking.destination, booking.filters);
    selectedRoute.value = response.data.route || { source: booking.origin, destination: booking.destination };
    matchedBuses.value = response.data.buses || [];

    if (!matchedBuses.value.length) {
      message.value = 'No buses available for this route right now. Try another date or route.';
    }
  } catch (error) {
    message.value = 'Unable to search buses right now. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const openBus = bus => {
  booking.selectedBus = bus;
  booking.selectedRoute = selectedRoute.value;
  router.push({ name: 'BusDetail', params: { id: bus.id } });
};

onMounted(loadResults);
</script>

<style scoped>
.results-list {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.empty-state {
  margin-top: 24px;
  color: #64748b;
  padding: 24px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.04);
}
</style>
