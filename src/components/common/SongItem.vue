<template>
  <div
    class="song-item"
    :class="{ 'is-playing': isCurrentSong, active: isActive }"
    role="button"
    tabindex="0"
    :aria-label="'播放 ' + song.title + ' - ' + song.artist"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="song-index">
      <span v-if="!isCurrentSong" class="index-text">{{ index }}</span>
      <Icon v-else icon="carbon:volume-up-filled" width="16" height="16" class="playing-icon" aria-label="正在播放" />
    </div>

    <div class="song-cover" v-if="showCover">
      <img :src="song.cover" :alt="song.title" />
    </div>

    <div class="song-info">
      <div class="song-title truncate-1">
        {{ song.title }}
      </div>
      <div class="song-artist truncate-1">
        {{ song.artist }}
      </div>
    </div>

    <div v-if="showAlbum" class="song-album truncate-1">
      {{ song.album }}
    </div>

    <div class="song-duration">
      {{ formatTime(song.duration) }}
    </div>

    <div class="song-actions">
      <button class="action-btn" @click.stop="handleLike" :class="{ liked: isLiked }" :aria-label="isLiked ? '取消喜欢' : '喜欢'">
        <Icon :icon="isLiked ? 'carbon:favorite-filled' : 'carbon:favorite'" width="16" height="16" aria-hidden="true" />
      </button>
      <button class="action-btn" @click.stop="handleAdd" aria-label="添加到播放列表">
        <Icon icon="carbon:add" width="16" height="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/format'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  song: Song
  index?: number | string
  showCover?: boolean
  showAlbum?: boolean
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  index: 1,
  showCover: false,
  showAlbum: true,
  isActive: false,
})

const playerStore = usePlayerStore()
const isCurrentSong = computed(() => playerStore.currentSong?.id === props.song.id)
const isLiked = computed(() => false) // TODO: Implement with favorites store

function handleClick() {
  playerStore.playSong(props.song)
}

function handleLike() {
  // TODO: Implement favorite toggle
}

function handleAdd() {
  playerStore.addToPlaylist(props.song)
}
</script>

<style scoped lang="scss">
.song-item {
  display: grid;
  grid-template-columns: 40px auto 1fr 60px 80px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $glass-light;

    .song-actions {
      opacity: 1;
    }
  }

  &.is-playing {
    background: $glass-light;

    .song-title {
      color: $primary-light;
    }
  }
}

.song-index {
  @include flex-center;
  width: 40px;
}

.index-text {
  font-size: 13px;
  color: $text-muted;
}

.playing-icon {
  color: $primary-light;
  animation: pulse 1.5s ease-in-out infinite;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: $radius-sm;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.song-info {
  min-width: 0;
}

.song-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.song-artist {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 2px;
}

.song-album {
  font-size: 13px;
  color: $text-secondary;
}

.song-duration {
  font-size: 13px;
  color: $text-secondary;
  text-align: right;
}

.song-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity $transition-fast;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
  }

  &.liked {
    color: #ef4444;
  }
}
</style>
