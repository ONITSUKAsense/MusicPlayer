<template>
  <a href="#main-content" class="skip-to-content">跳转到主要内容</a>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAudioEngine } from '@/composables/useAudioEngine'
import { usePlayerStore } from '@/stores/player'

useThemeStore()
useAudioEngine()

// Global keyboard shortcuts
function handleGlobalKeydown(e: KeyboardEvent) {
  // Don't intercept when typing in inputs
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

  if (e.code === 'Space') {
    e.preventDefault()
    const playerStore = usePlayerStore()
    if (playerStore.currentSong) {
      playerStore.togglePlay()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
