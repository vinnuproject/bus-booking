<template>
  <div class="loading-overlay">
    <div class="loading-card">
      <div class="spinner"></div>
      <p>Loading buses and seat availability...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
}

.loading-card {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 20px 24px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.16);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 4px solid rgba(255, 61, 0, 0.2);
  border-top-color: #ff3d00;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
