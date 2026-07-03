<template>
  <header class="navbar">
    <div class="navbar-left">
      <button class="hamburger-btn" @click="uiStore.toggleSidebar()" aria-label="切换侧边栏">
        <Icon icon="carbon:menu" width="20" height="20" aria-hidden="true" />
      </button>
      <h1 class="navbar-title">{{ route.meta.title || 'Aurora' }}</h1>
    </div>

    <div class="navbar-right">
      <button class="icon-btn" @click="themeStore.toggleTheme()" :aria-label="themeStore.themeMode === 'dark' ? '切换亮色模式' : '切换暗色模式'">
        <Icon :icon="themeStore.themeMode === 'dark' ? 'carbon:sun' : 'carbon:moon'" width="18" height="18" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const themeStore = useThemeStore()
const uiStore = useUiStore()
</script>

<style scoped lang="scss">
.navbar {
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 50;

  @include mobile {
    padding: 0 12px;
    background: rgba(11, 11, 14, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid $bg-border;
  }
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;

  @include mobile {
    font-size: 15px;
  }
}

.hamburger-btn {
  display: none;
  width: 34px;
  height: 34px;
  border-radius: $radius-md;
  border: none;
  background: transparent;
  color: $text-primary;
  cursor: pointer;
  @include flex-center;

  &:hover {
    background: $glass-light;
  }

  @include mobile {
    display: flex;
  }
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: $radius-full;
  border: none;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    background: $glass-light;
    color: $text-primary;
  }
}
</style>
