<template>
  <div class="player-bar" :class="{ 'has-song': !!currentSong }">
    <div class="player-bg" />
    <div class="player-glow" aria-hidden="true" />

    <!-- Left: Song info -->
    <div class="player-section player-left">
      <div class="current-cover" role="button" tabindex="0" aria-label="查看歌曲详情">
        <img
          v-if="currentSong?.coverUrl"
          :src="currentSong.coverUrl"
          :alt="currentSong.title"
          class="cover-img"
          :class="{ spinning: isPlaying }"
        />
        <div v-else class="cover-placeholder">
          <Icon icon="carbon:music" width="20" height="20" />
        </div>
      </div>
      <div class="current-info" v-if="currentSong">
        <div class="current-title truncate-1">{{ currentSong.title }}</div>
        <div class="current-artist truncate-1">{{ currentSong.artist || '未知艺术家' }}</div>
      </div>
      <div class="current-info empty" v-else>
        <div class="current-title">未播放</div>
        <div class="current-artist">选择一首歌曲开始播放</div>
      </div>
    </div>

    <!-- Center: Controls -->
    <div class="player-section player-center" role="group" aria-label="播放控制">
      <div class="controls-row">
        <button class="ctrl-btn secondary" @click="togglePlayMode" :title="playModeLabel" :aria-label="'播放模式: ' + playModeLabel">
          <Icon :icon="playModeIcon" width="15" height="15" />
        </button>
        <button class="ctrl-btn" @click="prev" :disabled="!hasPrev" aria-label="上一首">
          <Icon icon="carbon:skip-back-outline-filled" width="18" height="18" />
        </button>
        <button class="play-btn-main" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
          <Icon
            :icon="isPlaying ? 'carbon:pause-circle-filled' : 'carbon:play-circle-filled'"
            width="36" height="36"
          />
        </button>
        <button class="ctrl-btn" @click="next" :disabled="!hasNext" aria-label="下一首">
          <Icon icon="carbon:skip-forward-outline-filled" width="18" height="18" />
        </button>
        <button class="ctrl-btn secondary" @click="cycleSpeed" :aria-label="'播放速度: ' + playbackRate + '倍'">
          <span class="speed-badge">{{ playbackRate }}x</span>
        </button>
      </div>

      <!-- Progress -->
      <div class="progress-area">
        <span class="time">{{ currentTimeFormatted }}</span>
        <div
          class="progress-track-wrapper"
          ref="progressRef"
          role="slider"
          :aria-label="'播放进度'"
          :aria-valuemin="0"
          :aria-valuemax="duration"
          :aria-valuenow="currentTime"
          tabindex="0"
          @click="handleProgressClick"
          @keydown.left.prevent="seek(Math.max(0, currentTime - 5))"
          @keydown.right.prevent="seek(Math.min(duration, currentTime + 5))"
        >
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }" />
            <div class="progress-thumb" :style="{ left: progress + '%' }" />
          </div>
        </div>
        <span class="time">{{ durationFormatted }}</span>
      </div>
    </div>

    <!-- Right: Volume + Playlist -->
    <div class="player-section player-right">
      <div class="volume-control" role="group" aria-label="音量控制">
        <button class="ctrl-btn" @click="toggleMute" :aria-label="isMuted ? '取消静音' : '静音'">
          <Icon :icon="volumeIcon" width="16" height="16" />
        </button>
        <div
          class="volume-slider"
          ref="volumeRef"
          role="slider"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(displayVolume * 100)"
          tabindex="0"
          @click="handleVolumeClick"
          @keydown.left.prevent="setVolume(Math.max(0, volume - 0.1))"
          @keydown.right.prevent="setVolume(Math.min(1, volume + 0.1))"
        >
          <div class="volume-track">
            <div class="volume-fill" :style="{ width: displayVolume * 100 + '%' }" />
          </div>
        </div>
      </div>

      <button class="playlist-btn" @click="showPlaylist = !showPlaylist" :aria-label="'播放队列'">
        <Icon icon="carbon:playlist" width="16" height="16" />
        <span class="playlist-badge">{{ playlist.length }}</span>
      </button>
    </div>

    <!-- Playlist drawer -->
    <Transition name="drawer">
      <div v-if="showPlaylist" class="playlist-drawer" role="dialog" aria-label="播放队列" @keydown.escape="showPlaylist = false">
        <div class="drawer-header">
          <h3>播放队列</h3>
          <button class="drawer-clear" @click="clearPlaylist" aria-label="清空播放队列">清空</button>
        </div>
        <div class="drawer-list">
          <div
            v-for="(song, idx) in playlist"
            :key="song.id"
            class="drawer-item"
            :class="{ active: idx === currentIndex }"
            role="button"
            tabindex="0"
            @click="handlePlayFromQueue(idx)"
            @keydown.enter="handlePlayFromQueue(idx)"
          >
            <div class="drawer-item-cover">
              <img v-if="song.coverUrl" :src="song.coverUrl" :alt="song.title" />
              <div v-else class="drawer-cover-placeholder">
                <Icon icon="carbon:music" width="12" height="12" />
              </div>
            </div>
            <div class="drawer-item-info">
              <div class="drawer-item-title truncate-1">{{ song.title }}</div>
              <div class="drawer-item-artist truncate-1">{{ song.artist || '未知艺术家' }}</div>
            </div>
            <span class="drawer-item-duration">{{ formatTime(song.duration) }}</span>
            <button class="drawer-remove" @click.stop="removeFromPlaylist(song.id)" :aria-label="'从队列移除 ' + song.title">
              <Icon icon="carbon:close" width="12" height="12" />
            </button>
          </div>
          <div v-if="playlist.length === 0" class="drawer-empty">队列为空</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlayer } from '@/composables/usePlayer'
import { formatTime } from '@/utils/format'
import type { PlayMode } from '@/types/music'

const {
  currentSong, playlist, currentIndex, isPlaying, playMode,
  volume, currentTime, duration, isMuted, progress, playbackRate,
  currentTimeFormatted, durationFormatted, hasNext, hasPrev,
  togglePlay, next, prev, seek, setVolume, toggleMute,
  togglePlayMode, setPlaybackRate, removeFromPlaylist, clearPlaylist,
  handlePlayPlaylist,
} = usePlayer()

const showPlaylist = ref(false)
const progressRef = ref<HTMLElement>()
const volumeRef = ref<HTMLElement>()

const displayVolume = computed(() => isMuted.value ? 0 : volume.value)

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

function cycleSpeed() {
  const idx = speeds.indexOf(playbackRate.value)
  setPlaybackRate(speeds[(idx + 1) % speeds.length])
}

const playModeIcon = computed(() => ({
  sequential: 'carbon:repeat',
  random: 'carbon:shuffle',
  'repeat-one': 'carbon:repeat-one',
} as Record<PlayMode, string>)[playMode.value])

const playModeLabel = computed(() => ({
  sequential: '顺序播放',
  random: '随机播放',
  'repeat-one': '单曲循环',
} as Record<PlayMode, string>)[playMode.value])

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'carbon:volume-mute-filled'
  if (volume.value < 0.5) return 'carbon:volume-down-filled'
  return 'carbon:volume-up-filled'
})

function handleProgressClick(e: MouseEvent) {
  if (!progressRef.value || !currentSong.value) return
  const rect = progressRef.value.getBoundingClientRect()
  seek(((e.clientX - rect.left) / rect.width) * duration.value)
}

function handleVolumeClick(e: MouseEvent) {
  if (!volumeRef.value) return
  const rect = volumeRef.value.getBoundingClientRect()
  setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
}

function handlePlayFromQueue(idx: number) {
  handlePlayPlaylist(playlist.value, idx)
}
</script>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 200;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;

  @include mobile {
    height: 60px;
    padding: 0 8px;
    gap: 8px;
  }
}

.player-bg {
  position: absolute;
  inset: 0;
  background: rgba(12, 12, 16, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.player-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(99, 102, 241, 0.025), transparent);
  pointer-events: none;
}

.player-section {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.player-left {
  flex: 0 0 280px;
}

.player-center {
  flex: 1;
  flex-direction: column;
  gap: 4px;
  max-width: 560px;
}

.player-right {
  flex: 0 0 220px;
  justify-content: flex-end;
  gap: 12px;
}

// ====== Left: Song Info ======
.current-cover {
  width: 44px;
  height: 44px;
  border-radius: $radius-sm;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  &.spinning {
    animation: vinyl-spin 6s linear infinite;
  }
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;
}

.current-info {
  min-width: 0;
  flex: 1;

  &.empty .current-title,
  &.empty .current-artist {
    color: $text-muted;
  }
}

.current-title {
  font-size: 13px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.3;
}

.current-artist {
  font-size: 11px;
  color: $text-secondary;
  margin-top: 1px;
  line-height: 1.3;
}

// ====== Center: Controls ======
.controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.ctrl-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.06);
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;

    &:hover {
      color: $text-secondary;
      background: transparent;
    }
  }

  &.secondary {
    width: 26px;
    height: 26px;
  }
}

.play-btn-main {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    color: $primary-light;
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.96);
  }
}

.speed-badge {
  font-size: 10px;
  font-weight: 600;
  color: $text-muted;
  font-feature-settings: 'tnum';
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid $bg-border;
  line-height: 1.4;
  transition: all $transition-fast;

  .ctrl-btn:hover & {
    color: $primary-light;
    border-color: rgba(99, 102, 241, 0.3);
  }
}

// ====== Progress ======
.progress-area {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.time {
  font-size: 10px;
  color: $text-muted;
  min-width: 32px;
  font-feature-settings: 'tnum';
  font-weight: 500;

  &:first-child { text-align: right; }
  &:last-child { text-align: left; }
}

.progress-track-wrapper {
  flex: 1;
  height: 16px;
  @include flex-center;
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  position: relative;
  overflow: visible;
  transition: height 0.15s ease;

  .progress-track-wrapper:hover & {
    height: 5px;

    .progress-thumb {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.progress-fill {
  height: 100%;
  background: $gradient-primary;
  border-radius: 2px;
  transition: width 0.1s linear;
  position: relative;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%) scale(0);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: all 0.15s ease;
}

// ====== Right: Volume + Playlist ======
.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-slider {
  width: 52px;
  height: 16px;
  @include flex-center;
  cursor: pointer;
}

.volume-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.volume-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  transition: width 0.08s ease;
}

.playlist-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
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

.playlist-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 9px;
  font-weight: 700;
  background: $primary;
  color: white;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  @include flex-center;
}

// ====== Playlist Drawer ======
.playlist-drawer {
  position: absolute;
  bottom: 72px;
  right: 20px;
  width: 340px;
  max-height: 400px;
  background: rgba(16, 16, 20, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.5);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;

  h3 {
    font-size: 13px;
    font-weight: 600;
  }
}

.drawer-clear {
  font-size: 11px;
  color: $text-muted;
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: $radius-sm;
  transition: all $transition-fast;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
  }
}

.drawer-list {
  max-height: 340px;
  overflow-y: auto;
  @include custom-scrollbar;
  padding: 0 4px 4px;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.04);

    .drawer-remove {
      opacity: 1;
    }
  }

  &.active {
    background: rgba(99, 102, 241, 0.06);

    .drawer-item-title {
      color: $primary-light;
    }
  }
}

.drawer-item-cover {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.drawer-cover-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;
}

.drawer-item-info {
  flex: 1;
  min-width: 0;
}

.drawer-item-title {
  font-size: 12px;
  font-weight: 500;
}

.drawer-item-artist {
  font-size: 10px;
  color: $text-muted;
  margin-top: 1px;
}

.drawer-item-duration {
  font-size: 11px;
  color: $text-muted;
  font-feature-settings: 'tnum';
}

.drawer-remove {
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

.drawer-empty {
  padding: 32px 16px;
  text-align: center;
  color: $text-muted;
  font-size: 12px;
}

// ====== Drawer Transition ======
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

// Mobile
@include mobile {
  .player-bar {
    height: 60px;
  }

  .player-left {
    flex: 0 0 auto;
  }

  .player-center {
    max-width: none;
  }

  .player-right {
    display: none;
  }

  .current-cover {
    width: 36px;
    height: 36px;
  }

  .play-btn-main {
    width: 30px;
    height: 30px;
  }

  .progress-area {
    display: none;
  }

  .playlist-drawer {
    bottom: 60px;
    right: 8px;
    width: calc(100vw - 16px);
    max-height: 50vh;
  }
}
</style>
