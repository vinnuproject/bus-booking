<template>
  <section class="container page-grid">
    <div class="section-card">
      <div class="badge">Checkout</div>
      <h1 class="page-title">Confirm payment</h1>
      <p>Review your seat hold and complete the booking.</p>
      <div v-if="hold" class="summary-card">
        <div class="summary-row"><strong>Name</strong><span>{{ passengerName }}</span></div>
        <div class="summary-row"><strong>Bus</strong><span>{{ bus?.bus_number }}</span></div>
        <div class="summary-row"><strong>Seat</strong><span>{{ hold.seat_number }}</span></div>
        <div class="summary-row"><strong>Total</strong><span>₹{{ hold.total_price }}</span></div>
      </div>
      <div class="form-card">
        <label>Passenger name</label>
        <input v-model="passengerName" placeholder="Your full name" />
        <button class="primary-btn animated-btn" :disabled="!passengerName" @click="confirmBookingHandler">Confirm booking</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '../composables/useBooking';
import { confirmBooking } from '../services/booking.service';

const router = useRouter();
const { booking } = useBooking();
const passengerName = ref(booking.passengerName || '');
const hold = computed(() => booking.seatHold);
const bus = computed(() => booking.selectedBus);

const confirmBookingHandler = async () => {
  if (!hold.value) return;
  const response = await confirmBooking({ bookingId: hold.value.id });
  booking.bookingConfirmed = response.data;
  booking.passengerName = passengerName.value;
  booking.advance();
  router.push({ name: 'Confirmation' });
};

onMounted(() => {
  if (!hold.value) {
    router.push({ name: 'SearchResults' });
  }
});
</script>

<style scoped>
.summary-card,
.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  margin-top: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 1rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: #475569;
}

input {
  margin-bottom: 1.5rem;
}
</style>
