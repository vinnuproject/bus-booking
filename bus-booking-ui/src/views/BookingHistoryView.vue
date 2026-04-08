<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">Booking history</div>
      <h1 class="page-title">Your booked journeys</h1>
      <p>Review your confirmed trips and upcoming travel details.</p>
      <div v-if="loading" class="empty-state">
        <p>Loading your bookings...</p>
      </div>
      <div v-else-if="bookings.length" class="history-list">
        <div v-for="booking in bookings" :key="booking.id" class="history-card">
          <div class="history-row"><strong>Bus</strong><span>{{ booking.busId }}</span></div>
          <div class="history-row"><strong>Seat</strong><span>{{ booking.seat_number }}</span></div>
          <div class="history-row"><strong>Status</strong><span>{{ booking.status }}</span></div>
          <div class="history-row"><strong>Travel date</strong><span>{{ formatDate(booking.travel_date) }}</span></div>
          <div class="history-row"><strong>Total</strong><span>₹{{ booking.total_price }}</span></div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No booking history found. Search for a bus and make your first booking.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { fetchBookings } from '../services/booking.service';

const router = useRouter();
const auth = useAuthStore();
const bookings = ref([]);
const loading = ref(true);

const formatDate = date => new Date(date).toLocaleDateString();

onMounted(async () => {
  if (!auth.isAuthenticated()) {
    router.push({ name: 'Login' });
    return;
  }

  try {
    const response = await fetchBookings();
    bookings.value = response.data || [];
  } catch (error) {
    bookings.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.history-list {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.history-card {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 20px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 10px;
}

.empty-state {
  margin-top: 24px;
  color: #64748b;
  padding: 24px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.04);
}
</style>
