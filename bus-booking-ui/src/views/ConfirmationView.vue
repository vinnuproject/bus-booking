<template>
  <section class="container page-grid">
    <div class="section-card confirmation-panel">
      <div class="badge">Booking complete</div>
      <h1 class="page-title">Your seat is confirmed</h1>
      <p>Thanks for booking! Your ticket has been reserved and a confirmation is ready.</p>
      <div v-if="bookingConfirmed" class="ticket-card">
        <div class="ticket-row"><strong>Passenger</strong><span>{{ bookingConfirmed.userId }}</span></div>
        <div class="ticket-row"><strong>Bus</strong><span>{{ bookingConfirmed.busId }}</span></div>
        <div class="ticket-row"><strong>Seat</strong><span>{{ bookingConfirmed.seat_number }}</span></div>
        <div class="ticket-row"><strong>Date</strong><span>{{ travelDate }}</span></div>
        <div class="ticket-row total"><strong>Total paid</strong><span>₹{{ bookingConfirmed.total_price }}</span></div>
      </div>
      <div class="carbon-card" v-if="carbon">
        <h3>Green points earned</h3>
        <p>You saved <strong>{{ carbon.co2_saved_vs_car }}g CO2</strong> vs a car and <strong>{{ carbon.co2_saved_vs_flight }}g CO2</strong> vs a flight.</p>
        <p><strong>Green points:</strong> {{ carbon.green_points }}</p>
      </div>
      <div class="chat-card">
        <h3>Bus chat</h3>
        <div class="chat-log">
          <div v-for="(entry, index) in chatMessages" :key="index" class="chat-line">
            <span>{{ entry.time }}</span>
            <p>{{ entry.text }}</p>
          </div>
        </div>
        <div class="chat-input">
          <input v-model="message" placeholder="Send a message to fellow passengers" />
          <button class="primary-btn" @click="sendMessage">Send</button>
        </div>
      </div>
      <button class="primary-btn" @click="resetFlow">Book another bus</button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '../composables/useBooking';
import { fetchCarbonSavings } from '../services/booking.service';

const { booking } = useBooking();
const router = useRouter();
const bookingConfirmed = computed(() => booking.bookingConfirmed);
const travelDate = computed(() => booking.travelDate);
const carbon = ref(null);
const message = ref('');

const chatMessages = booking.chatMessages;

const sendMessage = () => {
  if (!message.value) return;
  chatMessages.push({ text: message.value, time: new Date().toLocaleTimeString() });
  message.value = '';
};

onMounted(async () => {
  if (!bookingConfirmed.value) {
    router.push({ name: 'Home' });
    return;
  }

  try {
    const response = await fetchCarbonSavings(bookingConfirmed.value.id);
    carbon.value = response.data.savings;
  } catch (err) {
    carbon.value = null;
  }
});

const resetFlow = () => {
  booking.reset();
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.confirmation-panel {
  text-align: center;
}

.ticket-card {
  margin: 2rem auto;
  max-width: 520px;
  background: #fff;
  border-radius: 28px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
  padding: 28px;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.ticket-row.total {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
}

.carbon-card,
.chat-card {
  margin: 24px auto 0;
  max-width: 520px;
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.chat-log {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.chat-line {
  background: rgba(248, 250, 252, 0.9);
  border-radius: 18px;
  padding: 14px;
}

.chat-line span {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 8px;
}

.chat-input {
  display: flex;
  gap: 12px;
}

.chat-input input {
  flex: 1;
}
</style>
