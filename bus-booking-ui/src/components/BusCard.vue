<template>
  <div class="bus-card">
    <div class="bus-card-left">
      <div class="route-chip">{{ route.source }} → {{ route.destination }}</div>
      <h3>{{ bus.bus_number }}</h3>
      <div class="info-row">
        <span>{{ bus.capacity }} seats</span>
        <span>{{ travelDate }}</span>
      </div>
      <div class="feature-row">
        <span>{{ bus.fuel_type || 'Standard' }}</span>
        <span>{{ bus.seating_type || 'Regular' }}</span>
        <span>{{ bus.has_wifi ? 'WiFi' : 'No WiFi' }}</span>
      </div>
    </div>
    <div class="bus-card-right">
      <div class="price">₹{{ price }}</div>
      <button class="primary-btn" @click="selectBus">View seats</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
const props = defineProps({ bus: Object, route: Object, travelDate: String });
const emit = defineEmits(['select']);
const price = computed(() => (Math.floor(props.bus.capacity * 15) + 499).toFixed(0));
const selectBus = () => emit('select', props.bus);
</script>

<style scoped>
.bus-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.bus-card-left {
  display: grid;
  gap: 12px;
}

.route-chip {
  display: inline-flex;
  padding: 0.65rem 1rem;
  background: rgba(255, 61, 0, 0.08);
  color: #c5302d;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

h3 {
  margin: 0;
  font-size: 1.35rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  color: #64748b;
  font-size: 0.95rem;
}

.feature-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
  color: #475569;
  font-size: 0.88rem;
}

.feature-row span {
  background: rgba(34, 197, 94, 0.12);
  padding: 6px 10px;
  border-radius: 999px;
}

.bus-card-right {
  display: grid;
  place-items: end;
  gap: 1rem;
}

.price {
  font-size: 1.7rem;
  font-weight: 700;
  color: #111827;
}
</style>
