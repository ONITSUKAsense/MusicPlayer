<template>
  <div class="home">
    <!-- Empty State -->
    <div v-if="!hasSongs" class="empty-state">
      <div class="empty-bg-glow" aria-hidden="true" />
      <div class="empty-hero">
        <div class="empty-icon-wrapper">
          <div class="empty-icon-ring" />
          <div class="empty-icon">
            <Icon icon="carbon:music" width="36" height="36" />
          </div>
        </div>
        <h2 class="empty-title">让音乐充满你的世界</h2>
        <p class="empty-desc">上传你的本地 MP3 文件，搭配 LRC 歌词与封面，打造属于你自己的音乐库</p>
      </div>
      <div class="empty-actions">
        <router-link to="/upload" class="action-btn primary">
          <Icon icon="carbon:cloud-upload" width="18" height="18" />
          开始上传音乐
        </router-link>
        <router-link to="/about" class="action-btn secondary">了解更多</router-link>
      </div>
      <div class="empty-features">
        <div v-for="feature in features" :key="feature.label" class="feature-chip">
          <Icon :icon="feature.icon" width="13" height="13" />
          <span>{{ feature.label }}</span>
        </div>
      </div>
    </div>

    <!-- Library View -->
    <div v-else class="library-layout">
      <!-- Now Playing Area -->
      <div v-if="currentSong" class="now-playing">
        <div class="now-ambient" aria-hidden="true" />
        <div class="now-inner">
          <div class="now-cover-section">
            <div class="now-cover-wrapper">
              <div class="now-cover-ring" :class="{ spinning: isPlaying }" />
              <div class="now-cover-shadow" />
              <div class="now-cover">
                <img
                  v-if="currentSong.coverUrl"
                  :src="currentSong.coverUrl"
                  :alt="currentSong.title"
                  :class="{ spinning: isPlaying }"
                />
                <div v-else class="now-cover-placeholder">
                  <Icon icon="carbon:music" width="28" height="28" />
                </div>
              </div>
            </div>
            <div class="now-meta">
              <h2 class="now-title">{{ currentSong.title }}</h2>
              <p class="now-artist">{{ currentSong.artist || '未知艺术家' }}</p>
            </div>
          </div>
          <div class="now-lyrics-section">
            <LyricDisplay />
          </div>
        </div>
      </div>

      <!-- Queue / Library -->
      <div class="library" :class="{ 'with-player': !!currentSong }">
        <div class="library-header">
          <div class="library-header-left">
            <h1 class="library-title">{{ currentSong ? '播放队列' : '音乐库' }}</h1>
            <span class="library-count">{{ songs.length }} 首歌曲</span>
          </div>
        </div>

        <div class="song-list">
          <div
            v-for="(song, idx) in songs"
            :key="song.id"
            class="song-row"
            :class="{ playing: song.id === currentSong?.id }"
            :style="{ animationDelay: `${idx * 0.03}s` }"
            role="button"
            tabindex="0"
            :aria-label="'播放 ' + song.title"
            @click="handlePlaySong(song)"
            @keydown.enter="handlePlaySong(song)"
            @keydown.space.prevent="handlePlaySong(song)"
          >
            <div class="song-row-index">
              <span v-if="song.id !== currentSong?.id" class="idx">{{ idx + 1 }}</span>
              <Icon v-else icon="carbon:volume-up-filled" width="14" height="14" class="playing-icon" />
            </div>
            <div class="song-row-cover">
              <img v-if="song.coverUrl" :src="song.coverUrl" :alt="song.title" />
              <div v-else class="cover-placeholder">
                <Icon icon="carbon:music" width="14" height="14" />
              </div>
            </div>
            <div class="song-row-info">
              <span class="song-row-title truncate-1">{{ song.title }}</span>
              <span class="song-row-artist truncate-1">{{ song.artist || '未知艺术家' }}</span>
            </div>
            <div class="song-row-actions">
              <button
                class="row-add-btn"
                :class="{ added: song.id === currentSong?.id }"
                @click.stop="addToPlaylist(song)"
                :aria-label="'添加到播放列表'"
                title="添加到播放列表"
              >
                <Icon icon="carbon:playlist" width="14" height="14" />
              </button>
            </div>
            <span class="song-row-duration">{{ formatTime(song.duration) }}</span>
          </div>

          <div v-if="songs.length === 0" class="song-list-empty">
            <p>还没有歌曲，去上传一些吧</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import { getSongList } from '@/db/songs'
import { formatTime } from '@/utils/format'
import type { LocalSong } from '@/types/music'
import LyricDisplay from '@/components/player/LyricDisplay.vue'

const playerStore = usePlayerStore()
const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)

const features = [
  { icon: 'carbon:music', label: 'MP3 播放' },
  { icon: 'carbon:document-text', label: 'LRC 歌词' },
  { icon: 'carbon:image', label: '封面管理' },
  { icon: 'carbon:shuffle', label: '多种模式' },
  { icon: 'carbon:volume-up', label: '速度调节' },
  { icon: 'carbon:asleep', label: '深色主题' },
]

const songs = ref<LocalSong[]>([])
const hasSongs = computed(() => songs.value.length > 0)

onMounted(async () => {
  songs.value = await getSongList()
})

function handlePlaySong(song: LocalSong) {
  playerStore.playSong(song)
}

function addToPlaylist(song: LocalSong) {
  playerStore.addToPlaylist(song)
  ElMessage.success(`已添加「${song.title}」到播放列表`)
}
</script>

<style scoped lang="scss">
// ====== Empty State ======
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - $navbar-height - $player-height - 56px);
  text-align: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.empty-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 60%);
  pointer-events: none;
}

.empty-hero {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
}

.empty-icon-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 24px;
}

.empty-icon-ring {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 1px solid rgba(99, 102, 241, 0.15);
  animation: float 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1px solid rgba(99, 102, 241, 0.08);
  }
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px $primary-glow;
}

.empty-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.empty-desc {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.7;
  max-width: 380px;
  margin: 0 auto;
}

.empty-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  border-radius: $radius-full;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all $transition-normal;
  cursor: pointer;

  &.primary {
    background: $gradient-primary;
    color: white;
    box-shadow: 0 4px 20px $primary-glow;

    &:hover {
      box-shadow: 0 8px 30px $primary-glow;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: $glass-medium;
    color: $text-primary;
    border: 1px solid $bg-border;

    &:hover {
      background: $glass-heavy;
      transform: translateY(-2px);
    }
  }
}

.empty-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: $glass-light;
  border: 1px solid $bg-border;
  border-radius: $radius-full;
  font-size: 12px;
  color: $text-secondary;

  svg {
    color: $primary-light;
  }
}

// ====== Library Layout ======
.library-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 0;
  height: calc(100vh - $navbar-height - $player-height - 56px);

  @include tablet-down {
    grid-template-columns: 1fr;
    height: auto;
  }
}

// ====== Now Playing ======
.now-playing {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 32px 16px 0;
  order: 1;

  @include tablet-down {
    order: -1;
    padding: 16px 0;
    min-height: 360px;
  }
}

.now-ambient {
  position: absolute;
  top: -20%;
  left: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
  pointer-events: none;

  @include tablet-down {
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
  }
}

.now-inner {
  display: flex;
  gap: 32px;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 1;

  @include mobile {
    flex-direction: column;
    gap: 16px;
  }
}

.now-cover-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.now-cover-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 16px;
}

.now-cover-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1.5px solid rgba(99, 102, 241, 0.1);
  transition: all 0.5s ease;

  &.spinning {
    border-color: rgba(99, 102, 241, 0.2);
    animation: vinyl-spin 10s linear infinite;
  }
}

.now-cover-shadow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px $primary-glow;
  z-index: 0;
}

.now-cover {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    &.spinning {
      animation: vinyl-spin 10s linear infinite;
    }
  }

  @include mobile {
    width: 140px;
    height: 140px;
  }
}

.now-cover-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;
}

.now-meta {
  text-align: center;
}

.now-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  line-height: 1.3;
}

.now-artist {
  font-size: 13px;
  color: $text-secondary;
}

.now-lyrics-section {
  flex: 1;
  min-width: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 360px;

  @include mobile {
    width: 100%;
    max-height: 200px;
  }
}

// ====== Library / Queue ======
.library {
  overflow-y: auto;
  @include custom-scrollbar;
  order: 2;
  padding-top: 4px;

  &.with-player {
    border-left: 1px solid $bg-border;
    padding-left: 20px;

    @include tablet-down {
      border-left: none;
      padding-left: 0;
    }
  }
}

.library-header {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.library-header-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.library-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.library-count {
  font-size: 12px;
  color: $text-muted;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.song-row {
  display: grid;
  grid-template-columns: 28px 36px 1fr auto 40px;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  animation: fade-in-up 0.4s ease-out both;

  &:hover {
    background: $glass-light;

    .row-add-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &.playing {
    background: rgba(99, 102, 241, 0.06);

    .song-row-title {
      color: $primary-light;
    }

    .song-row-index .idx {
      color: transparent;
    }
  }

  &:active {
    transform: scale(0.99);
  }
}

.song-row-index {
  @include flex-center;
  width: 28px;

  .idx {
    font-size: 12px;
    color: $text-muted;
    font-feature-settings: 'tnum';
    font-weight: 400;
  }
}

.playing-icon {
  color: $primary-light;
  animation: pulse 1.5s ease-in-out infinite;
}

.song-row-cover {
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: $shadow-sm;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;
}

.song-row-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.song-row-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.song-row-artist {
  font-size: 11px;
  color: $text-secondary;
  line-height: 1.3;
}

.song-row-actions {
  @include flex-center;
}

.row-add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  @include flex-center;
  opacity: 0;
  transform: translateY(4px);
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $primary-light;
  }

  &.added {
    opacity: 1;
    color: $primary-light;
  }
}

.song-row-duration {
  font-size: 11px;
  color: $text-muted;
  text-align: right;
  font-feature-settings: 'tnum';
}

.song-list-empty {
  padding: 40px 0;
  text-align: center;
  color: $text-muted;
  font-size: 13px;
}

// Mobile adjustments
@include mobile {
  .song-row {
    grid-template-columns: 28px 36px 1fr 40px;

    .song-row-duration {
      display: none;
    }
  }
}
</style>
