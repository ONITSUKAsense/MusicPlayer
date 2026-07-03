<template>
  <aside class="sidebar" :class="{ open: uiStore.sidebarOpen }" aria-label="主导航">
    <div class="sidebar-logo">
      <span class="logo-text">Aurora</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav" aria-label="导航菜单">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
        :aria-current="route.path === item.path ? 'page' : undefined"
        @click="uiStore.closeSidebar()"
      >
        <div class="nav-icon-wrapper">
          <Icon :icon="item.icon" width="18" height="18" aria-hidden="true" />
        </div>
        <span>{{ item.label }}</span>
        <div v-if="route.path === item.path" class="nav-indicator" />
      </router-link>
    </nav>

    <!-- Playlist Section -->
    <div class="sidebar-playlist" v-if="playerStore.playlist.length > 0">
      <div class="playlist-section-header">
        <Icon icon="carbon:playlist" width="14" height="14" />
        <span>播放队列</span>
        <span class="playlist-section-count">{{ playerStore.playlist.length }}</span>
      </div>
      <div class="playlist-list">
        <div
          v-for="(song, idx) in playerStore.playlist"
          :key="song.id"
          class="playlist-item"
          :class="{ active: idx === playerStore.currentIndex }"
          role="button"
          tabindex="0"
          :aria-label="'播放 ' + (song.title || '未命名')"
          @click="handlePlay(idx)"
          @keydown.enter="handlePlay(idx)"
          @keydown.space.prevent="handlePlay(idx)"
        >
          <div class="playlist-item-cover">
            <img v-if="song.coverUrl" :src="song.coverUrl" :alt="song.title" />
            <div v-else class="pl-cover-placeholder">
              <Icon icon="carbon:music" width="12" height="12" />
            </div>
          </div>
          <div class="playlist-item-info">
            <span class="playlist-item-title truncate-1">{{ song.title }}</span>
            <span class="playlist-item-artist truncate-1">{{ song.artist || '未知艺术家' }}</span>
          </div>
          <button
            class="playlist-remove-btn"
            @click.stop="playerStore.removeFromPlaylist(song.id)"
            :aria-label="'从队列移除 ' + song.title"
            title="移除"
          >
            <Icon icon="carbon:close" width="12" height="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-divider" />
      <div class="song-count">
        <Icon icon="carbon:music" width="13" height="13" aria-hidden="true" />
        <span>{{ songCount }} 首歌曲</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUiStore } from '@/stores/ui'
import { usePlayerStore } from '@/stores/player'
import { getSongCount } from '@/db/songs'

const route = useRoute()
const uiStore = useUiStore()
const playerStore = usePlayerStore()

const songCount = ref(0)

const navItems = [
  { path: '/', label: '首页', icon: 'carbon:home' },
  { path: '/upload', label: '上传音乐', icon: 'carbon:cloud-upload' },
  { path: '/settings', label: '设置', icon: 'carbon:settings' },
  { path: '/about', label: '关于', icon: 'carbon:information' },
]

onMounted(async () => {
  songCount.value = await getSongCount()
})

function handlePlay(index: number) {
  const song = playerStore.playlist[index]
  if (song) playerStore.playSong(song)
}
</script>

<style scoped lang="scss">
.sidebar {
  width: $sidebar-width;
  height: 100vh;
  background: $bg-surface;
  border-right: 1px solid $bg-border;
  display: flex;
  flex-direction: column;
  padding: 12px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @include custom-scrollbar;

  @include mobile {
    transform: translateX(-100%);
    width: 260px;
    background: rgba(18, 18, 22, 0.98);
    backdrop-filter: blur(20px);

    &.open {
      transform: translateX(0);
    }
  }
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  margin-bottom: 24px;

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    @include gradient-text;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $transition-fast;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  position: relative;

  &:hover {
    color: $text-primary;
    background: $glass-light;
  }

  &.active {
    color: white;
    background: rgba(99, 102, 241, 0.1);
  }
}

.nav-icon-wrapper {
  width: 30px;
  height: 30px;
  border-radius: $radius-sm;
  @include flex-center;
  flex-shrink: 0;
  transition: all $transition-fast;

  .nav-item.active & {
    background: rgba(99, 102, 241, 0.15);
    color: $primary-light;
  }
}

.nav-indicator {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 2px;
  background: $primary-light;

  @include mobile {
    right: -8px;
  }
}

// === Playlist ===
.sidebar-playlist {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.playlist-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $text-muted;
  margin-bottom: 4px;

  .playlist-section-count {
    margin-left: auto;
    font-size: 10px;
    background: $glass-light;
    padding: 1px 6px;
    border-radius: $radius-full;
  }
}

.playlist-list {
  flex: 1;
  overflow-y: auto;
  @include custom-scrollbar(4px);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $glass-light;

    .playlist-remove-btn {
      opacity: 1;
    }
  }

  &.active {
    background: rgba(99, 102, 241, 0.08);

    .playlist-item-title {
      color: $primary-light;
    }
  }
}

.playlist-item-cover {
  width: 28px;
  height: 28px;
  border-radius: $radius-sm;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.pl-cover-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;
}

.playlist-item-info {
  flex: 1;
  min-width: 0;
}

.playlist-item-title {
  font-size: 12px;
  font-weight: 500;
  display: block;
}

.playlist-item-artist {
  font-size: 10px;
  color: $text-muted;
  display: block;
  margin-top: 1px;
}

.playlist-remove-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  @include flex-center;
  opacity: 0;
  transition: all $transition-fast;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $text-primary;
  }
}

// === Footer ===
.sidebar-footer {
  margin-top: auto;
  flex-shrink: 0;
}

.sidebar-divider {
  height: 1px;
  background: $bg-border;
  margin: 8px 10px;
}

.song-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  color: $text-muted;
  font-size: 12px;
}
</style>
