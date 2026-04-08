<template>
  <div class="animated-bus-shell">
    <div class="road"></div>
    <div class="bus-body">
      <div class="window"></div>
      <div class="window"></div>
      <div class="grille"></div>
    </div>
    <div class="wheel front"></div>
    <div class="wheel rear"></div>
    <div class="sparkle sparkle-1"></div>
    <div class="sparkle sparkle-2"></div>
  </div>
</template>

<style scoped>
.animated-bus-shell {
  position: relative;
  width: 100%;
  height: 180px;
}

.road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  height: 8px;
  background: linear-gradient(90deg, rgba(15,23,42,0.2), transparent 55%);
  border-radius: 999px;
}

.bus-body {
  position: absolute;
  bottom: 28px;
  left: 50%;
  width: 220px;
  height: 88px;
  transform: translateX(-50%);
  border-radius: 28px;
  background: linear-gradient(135deg, #ff5d3c, #ff3210);
  box-shadow: 0 20px 40px rgba(255, 93, 60, 0.2);
  animation: floatBus 3.6s ease-in-out infinite;
}

.window {
  position: absolute;
  top: 18px;
  width: 40px;
  height: 26px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255,255,255,0.4);
}

.window:nth-child(1) { left: 22px; }
.window:nth-child(2) { left: 80px; }

.grille {
  position: absolute;
  right: 20px;
  top: 18px;
  width: 58px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255,255,255,0.15);
}

.wheel {
  position: absolute;
  bottom: 4px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #111827;
  border: 6px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.08);
}

.wheel.front { left: 26px; }
.wheel.rear { right: 26px; }

.sparkle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.8;
  filter: blur(0.5px);
  animation: sparkle 1.6s ease-in-out infinite;
}

.sparkle-1 {
  left: 18%;
  top: 14%;
}

.sparkle-2 {
  right: 18%;
  top: 12%;
  animation-delay: 0.45s;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.8); opacity: 0.3; }
}
</style>
