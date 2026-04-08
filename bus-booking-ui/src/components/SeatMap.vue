<template>
  <div class="seatmap-shell">
    <div class="seatmap-grid">
      <div
        v-for="seat in seats"
        :key="seat.seat_number"
        class="seat-cell"
        :class="[seat.status, { selected: props.selectedSeat === seat.seat_number }]"
        @click="selectSeat(seat)">
        <span>{{ seat.seat_number }}</span>
      </div>
    </div>
    <div class="legend-row">
      <div><span class="legend-dot available"></span> Available</div>
      <div><span class="legend-dot held"></span> Held</div>
      <div><span class="legend-dot booked"></span> Booked</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({ seats: Array, selectedSeat: String });
const emit = defineEmits(['select']);

const selectSeat = seat => {
  if (seat.status !== 'available') return;
  emit('select', seat);
};
</script>

<style scoped>
.seatmap-shell {
  display: grid;
  gap: 18px;
}

.seatmap-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(48px, 1fr));
  gap: 12px;
}

.seat-cell {
  min-height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.seat-cell.available {
  background: rgba(34, 197, 94, 0.12);
  color: #166534;
}

.seat-cell.selected {
  background: rgba(59, 130, 246, 0.18);
  border-color: #2563eb;
  color: #1d4ed8;
}

.seat-cell.held {
  background: rgba(245, 158, 11, 0.14);
  color: #92400e;
}

.seat-cell.booked {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.seat-cell:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 61, 0, 0.28);
}

.legend-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  color: #475569;
  font-size: 0.95rem;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.6rem;
}

.legend-dot.available { background: #16a34a; }
.legend-dot.held { background: #f59e0b; }
.legend-dot.booked { background: #ef4444; }
</style>
