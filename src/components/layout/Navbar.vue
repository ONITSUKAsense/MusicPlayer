<template>
  <header class="navbar">
    <div class="navbar-left">
      <!-- Hamburger for mobile -->
      <button class="hamburger-btn" @click="uiStore.toggleSidebar()" aria-label="切换侧边栏">
        <Icon icon="carbon:menu" width="20" height="20" aria-hidden="true" />
      </button>
      <div class="nav-actions hide-mobile" role="group" aria-label="页面导航">
        <button class="nav-btn" @click="goBack" aria-label="后退">
          <Icon icon="carbon:chevron-left" width="20" height="20" aria-hidden="true" />
        </button>
        <button class="nav-btn" @click="goForward" aria-label="前进">
          <Icon icon="carbon:chevron-right" width="20" height="20" aria-hidden="true" />
        </button>
      </div>
      <div class="navbar-title">{{ route.meta.title }}</div>
    </div>

    <div class="navbar-right">
      <button class="icon-btn" @click="handleSearch" aria-label="搜索">
        <Icon icon="carbon:search" width="20" height="20" aria-hidden="true" />
      </button>
      <button class="icon-btn hide-mobile" @click="themeStore.toggleTheme()" :aria-label="themeStore.themeMode === 'dark' ? '切换亮色模式' : '切换暗色模式'">
        <Icon :icon="themeStore.themeMode === 'dark' ? 'carbon:light' : 'carbon:moon'" width="20" height="20" aria-hidden="true" />
      </button>
      <button class="icon-btn hide-mobile" @click="handleNotifications" aria-label="消息通知">
        <Icon icon="carbon:notification" width="20" height="20" aria-hidden="true" />
      </button>

      <div
        v-if="userStore.isLoggedIn"
        class="user-menu"
        role="button"
        tabindex="0"
        :aria-expanded="showUserMenu"
        aria-label="用户菜单"
        @click="showUserMenu = !showUserMenu"
        @keydown.enter="showUserMenu = !showUserMenu"
        @keydown.space.prevent="showUserMenu = !showUserMenu"
      >
        <img :src="userStore.user?.avatar" class="user-avatar" :alt="userStore.user?.nickname || '用户头像'" />
        <span class="user-name hide-mobile">{{ userStore.user?.nickname }}</span>
      </div>
      <button v-else class="login-btn" @click="router.push('/login')" aria-label="登录">
        登录
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const uiStore = useUiStore()

const showUserMenu = ref(false)

function goBack() { router.back() }
function goForward() { router.forward() }
function handleSearch() { router.push('/search') }
function handleNotifications() { ElMessage.info('消息中心开发中') }
</script>

<style scoped lang="scss">
.navbar {
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  position: sticky;
  top: 0;
  z-index: 50;

  @include mobile {
    padding: 0 12px;
  }

  &-left,
  &-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-title {
    font-size: 16px;
    font-weight: 600;

    @include mobile {
      font-size: 14px;
    }
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

.nav-actions {
  display: flex;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: $text-primary;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
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

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $glass-light;
  }

  @include mobile {
    padding: 2px;
  }
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
}

.login-btn {
  padding: 6px 16px;
  border-radius: $radius-full;
  background: $gradient-primary;
  color: white;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}
</style>
