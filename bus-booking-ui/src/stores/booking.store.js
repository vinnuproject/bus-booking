import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookingStore = defineStore('booking', () => {
  const origin = ref('');
  const destination = ref('');
  const travelDate = ref(new Date().toISOString().slice(0, 10));
  const filters = ref({});
  const selectedBus = ref(null);
  const selectedRoute = ref(null);
  const passengerName = ref('');
  const seatHold = ref(null);
  const bookingConfirmed = ref(null);
  const language = ref('en');
  const chatMessages = ref([]);

  const step = ref('search');

  const steps = ['search', 'seatSelection', 'passengerDetails', 'checkout', 'confirmed'];

  const advance = () => {
    const nextIndex = steps.indexOf(step.value) + 1;
    if (nextIndex < steps.length) {
      step.value = steps[nextIndex];
    }
  };

  const reset = () => {
    origin.value = '';
    destination.value = '';
    travelDate.value = new Date().toISOString().slice(0, 10);
    selectedBus.value = null;
    selectedRoute.value = null;
    passengerName.value = '';
    seatHold.value = null;
    bookingConfirmed.value = null;
    step.value = 'search';
  };

  const routeInfo = computed(() => {
    if (!selectedRoute.value) return null;
    return selectedRoute.value;
  });

  return {
    origin,
    destination,
    travelDate,
    selectedBus,
    selectedRoute,
    passengerName,
    seatHold,
    bookingConfirmed,
    filters,
    language,
    chatMessages,
    step,
    routeInfo,
    advance,
    reset
  };
});
