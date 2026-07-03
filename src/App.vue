<template>
  <!-- Background image layer — full viewport, behind content -->
  <Transition name="bg-fade">
    <div v-if="bgStore.hasBackground" class="bg-image-layer" :style="{ backgroundImage: `url(${bgStore.bgImage})`, zIndex: 0 }" />
  </Transition>
  <Transition name="bg-fade">
    <div
      v-if="bgStore.hasBackground"
      class="bg-overlay-layer"
      :style="{
        '--bg-overlay-opacity': bgStore.opacity,
        '--bg-blur': bgStore.blur + 'px',
        zIndex: 0,
      }"
    />
  </Transition>

  <!-- All content sits above the background -->
  <div class="app-content">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useBackgroundStore } from '@/stores/background'
import { usePlayerStore } from '@/stores/player'
import { useAudioEngine } from '@/composables/useAudioEngine'

const playerStore = usePlayerStore()
const bgStore = useBackgroundStore()
useThemeStore()
playerStore.loadFromStorage()
bgStore.loadBackground()

// When custom background is set, add class to <html> so all CSS variables adapt
watch(() => bgStore.hasBackground, (val) => {
  document.documentElement.classList.toggle('has-custom-bg', val)
}, { immediate: true })

const { destroy } = useAudioEngine()

function handleGlobalKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

  switch (e.code) {
    case 'Space':
      e.preventDefault()
      if (playerStore.currentSong) {
        playerStore.togglePlay()
      }
      break
    case 'ArrowRight':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        playerStore.next()
      }
      break
    case 'ArrowLeft':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        playerStore.prev()
      }
      break
    case 'ArrowUp':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        playerStore.setVolume(Math.min(1, playerStore.volume + 0.1))
      }
      break
    case 'ArrowDown':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        playerStore.setVolume(Math.max(0, playerStore.volume - 0.1))
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  destroy()
})
</script>

<style lang="scss">
@import '@/styles/global.scss';

// Content wrapper sits above the background
.app-content {
  position: relative;
  z-index: 1;
}

// Fade transition for background layers
.bg-fade-enter-active {
  transition: opacity 0.6s ease;
}
.bg-fade-leave-active {
  transition: opacity 0.3s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

// When custom background is active, make surface colors semi-transparent
// so the background image shows through behind all content.
// SCSS variables ($bg-dark, $bg-card, etc.) all reference var(--bg-*),
// so changing these CSS vars cascades into every component automatically.
.has-custom-bg {
  --bg-dark: rgba(11, 11, 14, 0.82);
  --bg-surface: rgba(18, 18, 22, 0.82);
  --bg-card: rgba(24, 24, 29, 0.85);
  --bg-elevated: rgba(30, 30, 36, 0.85);
  --bg-border: rgba(255, 255, 255, 0.04);
}

// Light theme adaptations for custom background
[data-theme='light'].has-custom-bg {
  --bg-dark: rgba(243, 244, 246, 0.82);
  --bg-surface: rgba(255, 255, 255, 0.82);
  --bg-card: rgba(240, 240, 242, 0.88);
  --bg-elevated: rgba(232, 232, 236, 0.88);
  --bg-border: rgba(0, 0, 0, 0.04);
}
</style>
