<template>
  <div class="splash" @click="enterApp">
    <div class="splash-bg">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
    </div>

    <div class="splash-content">
      <div class="logo-container">
        <div class="logo-icon">
          <Icon icon="carbon:music" width="48" height="48" />
        </div>
        <h1 class="app-name">Music Player</h1>
        <p class="tagline">感受音乐的魅力</p>
      </div>

      <div class="loading-indicator">
        <div class="loading-dot" v-for="i in 3" :key="i" />
      </div>
    </div>

    <div class="splash-footer">
      <span>点击任意位置进入</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    // Auto enter after some time
  }, 3000)
})

function enterApp() {
  router.replace('/home')
}
</script>

<style scoped lang="scss">
.splash {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-dark;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.splash-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;

  &.orb-1 {
    width: 400px;
    height: 400px;
    background: #6366f1;
    top: -100px;
    left: -100px;
    animation: float 8s ease-in-out infinite;
  }

  &.orb-2 {
    width: 300px;
    height: 300px;
    background: #8b5cf6;
    bottom: -50px;
    right: -50px;
    animation: float 6s ease-in-out infinite reverse;
  }

  &.orb-3 {
    width: 250px;
    height: 250px;
    background: #06b6d4;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: float 7s ease-in-out infinite 1s;
  }
}

.splash-content {
  text-align: center;
  z-index: 1;
  animation: fadeIn 0.8s ease-out;
}

.logo-container {
  margin-bottom: 48px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: $gradient-primary;
  border-radius: 20px;
  @include flex-center;
  color: white;
  box-shadow: $shadow-glow;
  animation: float 4s ease-in-out infinite;
}

.app-name {
  font-size: 32px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.tagline {
  font-size: 16px;
  color: $text-secondary;
}

.loading-indicator {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $primary;
  animation: loadingPulse 1.2s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

.splash-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: $text-muted;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes loadingPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}
</style>
