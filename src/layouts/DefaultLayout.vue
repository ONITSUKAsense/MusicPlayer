<template>
  <div class="layout">
    <!-- Ambient background glow -->
    <div class="ambient-bg" aria-hidden="true" />

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div v-if="uiStore.sidebarOpen && isMobile" class="mobile-overlay" aria-hidden="true" @click="uiStore.closeSidebar()" />
    </Transition>

    <Sidebar />
    <div class="layout-main" id="main-content">
      <Navbar />
      <main class="layout-content" ref="contentRef" role="main">
        <router-view v-slot="{ Component, route }">
          <transition mode="out-in" @enter="pageEnter" @leave="pageLeave">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
    <PlayerBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useUiStore } from '@/stores/ui'
import { useResponsive } from '@/composables/useResponsive'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'
import PlayerBar from '@/components/player/PlayerBar.vue'

const route = useRoute()
const uiStore = useUiStore()
const { isMobile } = useResponsive()

function pageEnter(el: Element, done: () => void) {
  gsap.fromTo(
    el, { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', onComplete: done }
  )
}

function pageLeave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', onComplete: done,
  })
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100vh;
  background: $bg-dark;
  overflow: hidden;
  position: relative;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 90;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: $sidebar-width;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;

  @include mobile {
    margin-left: 0;
  }
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  padding-bottom: calc($player-height + 28px);
  @include custom-scrollbar;
  position: relative;
  z-index: 1;

  @include mobile {
    padding: 16px;
    padding-bottom: calc(60px + 16px);
  }
}
</style>
