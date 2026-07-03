<template>
  <aside class="sidebar" :class="{ open: uiStore.sidebarOpen, mobile: isMobile }" aria-label="主导航">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <Icon icon="carbon:music" width="28" height="28" />
      </div>
      <span class="logo-text">Music Player</span>
    </div>

    <nav class="sidebar-nav" aria-label="浏览">
      <div class="nav-section-title">浏览</div>
      <router-link
        v-for="item in mainNav"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="isMobile && uiStore.closeSidebar()"
      >
        <Icon :icon="item.icon" width="20" height="20" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <nav class="sidebar-nav" aria-label="发现">
      <div class="nav-section-title">发现</div>
      <router-link
        v-for="item in exploreNav"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="isMobile && uiStore.closeSidebar()"
      >
        <Icon :icon="item.icon" width="20" height="20" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <nav class="sidebar-nav" aria-label="我的">
      <div class="nav-section-title">我的</div>
      <router-link
        v-for="item in myNav"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="isMobile && uiStore.closeSidebar()"
      >
        <Icon :icon="item.icon" width="20" height="20" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-divider" />
      <button class="sidebar-upgrade" @click="handleUpgrade" aria-label="升级会员">
        <Icon icon="carbon:upgrade" width="18" height="18" aria-hidden="true" />
        <span>升级会员</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUiStore } from '@/stores/ui'
import { useResponsive } from '@/composables/useResponsive'
import { ElMessage } from 'element-plus'

const route = useRoute()
const uiStore = useUiStore()
const { isMobile } = useResponsive()

interface NavItem {
  path: string
  label: string
  icon: string
}

const mainNav: NavItem[] = [
  { path: '/home', label: '首页', icon: 'carbon:home' },
  { path: '/explore/recommend', label: '推荐音乐', icon: 'carbon:rocket' },
  { path: '/explore/charts', label: '热门榜单', icon: 'carbon:chart-line' },
  { path: '/explore/mv', label: 'MV专区', icon: 'carbon:video' },
]

const exploreNav: NavItem[] = [
  { path: '/search', label: '搜索', icon: 'carbon:search' },
  { path: '/playlists', label: '歌单', icon: 'carbon:playlist' },
  { path: '/artists', label: '歌手', icon: 'carbon:user-avatar' },
  { path: '/albums', label: '专辑', icon: 'carbon:album' },
]

const myNav: NavItem[] = [
  { path: '/collection/likes', label: '我喜欢', icon: 'carbon:favorite' },
  { path: '/collection/history', label: '最近播放', icon: 'carbon:time' },
  { path: '/my/playlists', label: '我的歌单', icon: 'carbon:list' },
]

function isActive(path: string): boolean {
  return route.path.startsWith(path.split('/').slice(0, 3).join('/'))
}

function handleUpgrade() {
  ElMessage.info('会员功能开发中')
}
</script>

<style scoped lang="scss">
.sidebar {
  width: $sidebar-width;
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  transition: transform 0.3s ease;
  @include custom-scrollbar;

  // Mobile: slide from left
  @include mobile {
    transform: translateX(-100%);
    width: 260px;

    &.open {
      transform: translateX(0);
    }
  }

  &-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    margin-bottom: 24px;

    .logo-icon {
      width: 36px;
      height: 36px;
      background: $gradient-primary;
      border-radius: 10px;
      @include flex-center;
      color: white;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      @include gradient-text;
    }
  }

  &-nav {
    margin-bottom: 20px;
  }

  &-footer {
    margin-top: auto;
  }

  &-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 8px 0;
  }

  &-upgrade {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: $radius-md;
    color: $text-secondary;
    cursor: pointer;
    transition: all $transition-fast;
    font-size: 14px;

    &:hover {
      background: $glass-light;
      color: $primary-light;
    }
  }
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 12px;
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $transition-fast;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 2px;
  position: relative;

  &:hover {
    color: $text-primary;
    background: $glass-light;
  }

  &.active {
    color: white;
    background: $glass-medium;

    &::before {
      content: '';
      position: absolute;
      left: -12px;
      width: 3px;
      height: 20px;
      background: $primary;
      border-radius: 0 3px 3px 0;

      @include mobile {
        left: -8px;
      }
    }
  }
}
</style>
