<template>
  <div class="player-bar" :class="{ 'has-song': !!currentSong }">
    <div class="player-bg" />

    <!-- Left: Song info -->
    <div class="player-section player-left">
      <div class="current-cover" @click="showDetailPanel = true" role="button" tabindex="0" aria-label="查看歌曲详情" @keydown.enter="showDetailPanel = true" @keydown.space.prevent="showDetailPanel = true">
        <img
          v-if="currentSong"
          :src="currentSong.cover"
          :alt="currentSong.title"
          class="cover-img"
          :class="{ spinning: isPlaying }"
        />
        <div v-else class="cover-placeholder" aria-hidden="true">
          <Icon icon="carbon:music" width="24" height="24" aria-hidden="true" />
        </div>
      </div>
      <div class="current-info" v-if="currentSong">
        <div class="current-title truncate-1">{{ currentSong.title }}</div>
        <div class="current-artist truncate-1">{{ currentSong.artist }}</div>
      </div>
      <div class="current-info empty" v-else>
        <div class="current-title">未播放</div>
        <div class="current-artist">选择一首歌曲开始播放</div>
      </div>
      <button class="like-btn" :class="{ liked: isLiked }" @click="toggleLike" :aria-label="isLiked ? '取消喜欢' : '喜欢'">
        <Icon :icon="isLiked ? 'carbon:favorite-filled' : 'carbon:favorite'" width="16" height="16" aria-hidden="true" />
      </button>
    </div>

    <!-- Center: Controls + Progress -->
    <div class="player-section player-center" role="group" aria-label="播放控制">
      <div class="controls">
        <button class="ctrl-btn" @click="prev" :disabled="!hasPrev" aria-label="上一首">
          <Icon icon="carbon:skip-back-outline-filled" width="20" height="20" aria-hidden="true" />
        </button>
        <button class="ctrl-btn play-btn-main" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
          <Icon
            :icon="isPlaying ? 'carbon:pause-circle-filled' : 'carbon:play-circle-filled'"
            width="36" height="36"
            aria-hidden="true"
          />
        </button>
        <button class="ctrl-btn" @click="next" :disabled="!hasNext" aria-label="下一首">
          <Icon icon="carbon:skip-forward-outline-filled" width="20" height="20" aria-hidden="true" />
        </button>

        <!-- Equalizer -->
        <div class="equalizer" v-if="isPlaying" aria-hidden="true" role="presentation">
          <span v-for="i in 4" :key="i" class="eq-bar" :style="{ animationDelay: `${i * 0.12}s` }" />
        </div>
      </div>

      <div class="progress-area">
        <span class="time current" aria-label="当前播放时间">{{ currentTimeFormatted }}</span>
        <div
          class="progress-bar-wrapper"
          ref="progressRef"
          role="slider"
          :aria-label="'播放进度'"
          :aria-valuemin="0"
          :aria-valuemax="duration"
          :aria-valuenow="currentTime"
          :aria-valuetext="currentTimeFormatted + ' / ' + durationFormatted"
          tabindex="0"
          @click="handleProgressClick"
          @keydown.left.prevent="seek(Math.max(0, currentTime - 5))"
          @keydown.right.prevent="seek(Math.min(duration, currentTime + 5))"
          @keydown.home.prevent="seek(0)"
          @keydown.end.prevent="seek(duration)"
        >
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }" />
            <div class="progress-thumb" :style="{ left: progress + '%' }" />
          </div>
        </div>
        <span class="time total" aria-label="总时长">{{ durationFormatted }}</span>
      </div>
    </div>

    <!-- Right: Volume + Mode + Speed + Playlist -->
    <div class="player-section player-right">
      <button class="ctrl-btn" @click="togglePlayMode" :title="playModeLabel" :aria-label="'播放模式: ' + playModeLabel">
        <Icon :icon="playModeIcon" width="18" height="18" aria-hidden="true" />
      </button>

      <!-- Speed control -->
      <button class="speed-control" @click="cycleSpeed" :aria-label="'播放速度: ' + playbackRate + '倍'">
        <span class="speed-label">{{ playbackRate }}x</span>
      </button>

      <div class="volume-control" role="group" aria-label="音量控制">
        <button class="ctrl-btn" @click="toggleMute" :aria-label="isMuted ? '取消静音' : '静音'">
          <Icon :icon="volumeIcon" width="18" height="18" aria-hidden="true" />
        </button>
        <div
          class="volume-slider"
          ref="volumeRef"
          role="slider"
          aria-label="音量"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(displayVolume * 100)"
          tabindex="0"
          @click="handleVolumeClick"
          @keydown.left.prevent="setVolume(Math.max(0, volume - 0.1))"
          @keydown.right.prevent="setVolume(Math.min(1, volume + 0.1))"
          @keydown.home.prevent="setVolume(0)"
          @keydown.end.prevent="setVolume(1)"
        >
          <div class="volume-track">
            <div class="volume-fill" :style="{ width: displayVolume * 100 + '%' }" />
          </div>
        </div>
      </div>

      <button class="ctrl-btn" @click="showPlaylist = !showPlaylist" :aria-label="'播放队列'">
        <Icon icon="carbon:playlist" width="18" height="18" aria-hidden="true" />
        <span class="playlist-count" aria-hidden="true">{{ playlist.length }}</span>
      </button>
    </div>

    <!-- Playlist drawer -->
    <Transition name="slide-up">
      <div v-if="showPlaylist" class="playlist-drawer" role="dialog" aria-label="播放队列" @keydown.escape="showPlaylist = false">
        <div class="playlist-header">
          <h3>播放队列 ({{ playlist.length }})</h3>
          <button class="clear-btn" @click="clearPlaylist" aria-label="清空播放队列">清空</button>
        </div>
        <div class="playlist-list">
          <div
            v-for="(song, idx) in playlist"
            :key="song.id"
            class="playlist-item"
            :class="{ active: idx === currentIndex }"
            role="button"
            tabindex="0"
            :aria-label="'播放 ' + song.title + ' - ' + song.artist"
            @click="handlePlayFromQueue(idx)"
            @keydown.enter="handlePlayFromQueue(idx)"
            @keydown.space.prevent="handlePlayFromQueue(idx)"
          >
            <img :src="song.cover" class="item-cover" :alt="song.title" />
            <div class="item-info">
              <div class="item-title truncate-1">{{ song.title }}</div>
              <div class="item-artist truncate-1">{{ song.artist }}</div>
            </div>
            <span class="item-duration">{{ formatTime(song.duration) }}</span>
            <button class="remove-btn" @click.stop="removeFromPlaylist(song.id)" :aria-label="'从队列移除 ' + song.title">
              <Icon icon="carbon:close" width="14" height="14" aria-hidden="true" />
            </button>
          </div>
          <div v-if="playlist.length === 0" class="playlist-empty">队列为空</div>
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
} = usePlayer()

const showPlaylist = ref(false)
const showDetailPanel = ref(false)
const isLiked = ref(false)
const progressRef = ref<HTMLElement>()
const volumeRef = ref<HTMLElement>()

const displayVolume = computed(() => isMuted.value ? 0 : volume.value)

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

function cycleSpeed() {
  const idx = speeds.indexOf(playbackRate.value)
  const nextIdx = (idx + 1) % speeds.length
  setPlaybackRate(speeds[nextIdx])
}

const playModeIcon = computed(() => {
  const icons: Record<PlayMode, string> = {
    sequential: 'carbon:repeat',
    random: 'carbon:shuffle',
    'repeat-one': 'carbon:repeat-one',
  }
  return icons[playMode.value]
})

const playModeLabel = computed(() => {
  const labels: Record<PlayMode, string> = {
    sequential: '顺序播放',
    random: '随机播放',
    'repeat-one': '单曲循环',
  }
  return labels[playMode.value]
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'carbon:volume-mute-filled'
  if (volume.value < 0.5) return 'carbon:volume-down-filled'
  return 'carbon:volume-up-filled'
})

function handleProgressClick(e: MouseEvent) {
  if (!progressRef.value || !currentSong.value) return
  const rect = progressRef.value.getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  seek(pct * duration.value)
}

function handleVolumeClick(e: MouseEvent) {
  if (!volumeRef.value) return
  const rect = volumeRef.value.getBoundingClientRect()
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  setVolume(pct)
}

function handlePlayFromQueue(idx: number) {
  const { playPlaylist } = usePlayer()
  playPlaylist(playlist.value, idx)
}

function toggleLike() {
  isLiked.value = !isLiked.value
}
</script>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $player-height;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 200;
  gap: 24px;
}

.player-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(99, 102, 241, 0.03), transparent);
  pointer-events: none;
}

.player-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-left { flex: 0 0 300px; }
.player-center { flex: 1; flex-direction: column; gap: 4px; max-width: 600px; }
.player-right { flex: 0 0 250px; justify-content: flex-end; }

// Current song info
.current-cover {
  width: 52px; height: 52px; border-radius: $radius-md;
  overflow: hidden; cursor: pointer; flex-shrink: 0;
}

.cover-img {
  width: 100%; height: 100%; object-fit: cover; border-radius: $radius-md;
  &.spinning { animation: vinyl-spin 8s linear infinite; }
}

.cover-placeholder {
  width: 100%; height: 100%; background: $bg-card;
  @include flex-center; color: $text-muted;
}

.current-info {
  min-width: 0; flex: 1;
  &.empty .current-title,
  &.empty .current-artist { color: $text-muted; }
}

.current-title { font-size: 14px; font-weight: 500; color: $text-primary; }
.current-artist { font-size: 12px; color: $text-secondary; margin-top: 2px; }

.like-btn {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: transparent; color: $text-secondary; cursor: pointer;
  @include flex-center; transition: all $transition-fast;
  &:hover { color: $text-primary; background: rgba(255,255,255,0.08); }
  &.liked { color: #ef4444; }
}

// Controls
.controls {
  display: flex; align-items: center; justify-content: center; gap: 8px;
}

.ctrl-btn {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: transparent; color: $text-secondary; cursor: pointer;
  @include flex-center; transition: all $transition-fast; position: relative;
  &:hover { color: $text-primary; }
  &:disabled { opacity: 0.3; cursor: not-allowed; &:hover { color: $text-secondary; } }
}

.play-btn-main {
  width: 40px; height: 40px; color: white;
  &:hover { color: $primary-light; transform: scale(1.05); }
}

.playlist-count {
  position: absolute; top: -2px; right: -2px; font-size: 10px;
  background: $primary; color: white; border-radius: 50%;
  width: 16px; height: 16px; @include flex-center;
}

// Equalizer
.equalizer {
  display: flex; align-items: center; gap: 3px; height: 20px; margin-left: 4px;
}

.eq-bar {
  width: 3px; background: $primary-light; border-radius: 1px;
  animation: equalizer 0.8s ease-in-out infinite;
  height: 4px;
  &:nth-child(1) { height: 10px; }
  &:nth-child(2) { height: 16px; }
  &:nth-child(3) { height: 12px; }
  &:nth-child(4) { height: 8px; }
}

// Speed control
.speed-control {
  cursor: pointer; padding: 2px 6px; border-radius: $radius-sm;
  border: 1px solid rgba(255,255,255,0.12); font-size: 11px;
  color: $text-secondary; transition: all $transition-fast;
  user-select: none;
  &:hover { border-color: $primary-light; color: $primary-light; }
}

.speed-label { font-weight: 600; font-feature-settings: 'tnum'; }

// Progress bar
.progress-area {
  display: flex; align-items: center; gap: 8px; width: 100%;
}

.time {
  font-size: 11px; color: $text-muted; min-width: 40px;
  &.current { text-align: right; }
  &.total { text-align: left; }
}

.progress-bar-wrapper {
  flex: 1; height: 20px; @include flex-center; cursor: pointer;
}

.progress-track {
  width: 100%; height: 4px; background: rgba(255,255,255,0.1);
  border-radius: 2px; position: relative; transition: height 0.1s ease;
  &:hover {
    height: 6px;
    .progress-thumb { opacity: 1; }
  }
}

.progress-fill {
  height: 100%; background: $gradient-primary; border-radius: 2px;
  transition: width 0.1s linear; position: relative;
}

.progress-thumb {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 12px; height: 12px; border-radius: 50%; background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.2s ease;
}

// Volume
.volume-control { display: flex; align-items: center; gap: 6px; }

.volume-slider {
  width: 60px; height: 20px; @include flex-center; cursor: pointer;
}

.volume-track {
  width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;
}

.volume-fill { height: 100%; background: white; border-radius: 2px; transition: width 0.1s ease; }

// Playlist drawer
.playlist-drawer {
  position: absolute; bottom: $player-height; right: 24px; width: 360px;
  max-height: 400px; background: rgba(20,20,20,0.98);
  backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08);
  border-radius: $radius-lg $radius-lg 0 0; overflow: hidden;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
}

.playlist-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
  h3 { font-size: 14px; font-weight: 600; }
}

.clear-btn {
  font-size: 12px; color: $text-secondary; background: none; border: none;
  cursor: pointer; padding: 4px 8px; border-radius: $radius-sm;
  &:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
}

.playlist-list { max-height: 340px; overflow-y: auto; @include custom-scrollbar; }

.playlist-item {
  display: flex; align-items: center; gap: 10px; padding: 8px 16px;
  cursor: pointer; transition: background $transition-fast;
  &:hover { background: rgba(255,255,255,0.05); .remove-btn { opacity: 1; } }
  &.active { background: rgba(99,102,241,0.1); .item-title { color: $primary-light; } }
}

.item-cover { width: 36px; height: 36px; border-radius: $radius-sm; object-fit: cover; }
.item-info { flex: 1; min-width: 0; }
.item-title { font-size: 13px; font-weight: 500; }
.item-artist { font-size: 11px; color: $text-secondary; margin-top: 2px; }
.item-duration { font-size: 12px; color: $text-secondary; }

.remove-btn {
  width: 24px; height: 24px; border-radius: 50%; border: none;
  background: transparent; color: $text-muted; cursor: pointer;
  @include flex-center; opacity: 0; transition: all $transition-fast;
  &:hover { background: rgba(255,255,255,0.1); color: $text-primary; }
}

.playlist-empty { padding: 40px 16px; text-align: center; color: $text-muted; font-size: 13px; }

// Mobile responsive
@include mobile {
  .player-bar {
    height: 60px;
    padding: 0 8px;
    gap: 8px;
  }

  .player-left { flex: 0 0 auto; }
  .player-center { max-width: none; }
  .player-right { display: none; }

  .current-cover { width: 40px; height: 40px; }

  .controls { gap: 4px; }
  .play-btn-main { width: 32px; height: 32px; }
  .play-btn-main :deep(svg) { width: 28px; height: 28px; }

  .current-artist { display: none; }
  .like-btn { display: none; }

  .progress-area { gap: 4px; }
  .time { font-size: 10px; min-width: 30px; }

  .playlist-drawer {
    right: 8px;
    width: calc(100vw - 16px);
    max-height: 50vh;
  }

  .equalizer { display: none; }
}
</style>
