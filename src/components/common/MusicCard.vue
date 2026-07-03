<template>
  <div class="music-card" @click="handleClick" role="button" tabindex="0" :aria-label="'查看 ' + title" @keydown.enter="handleClick" @keydown.space.prevent="handleClick">
    <div class="card-image-wrapper">
      <img
        v-lazy="cover"
        :alt="title"
        class="card-image"
      />
      <div class="card-overlay">
        <button class="play-btn" @click.stop="handlePlay" :aria-label="'播放 ' + title">
          <Icon icon="carbon:play-filled-alt" width="28" height="28" aria-hidden="true" />
        </button>
      </div>
      <div v-if="playCount" class="card-play-count" aria-label="播放次数">
        <Icon icon="carbon:headphones" width="12" height="12" aria-hidden="true" />
        {{ formatCount(playCount) }}
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title truncate-1">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle truncate-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { formatCount } from '@/utils/format'

interface Props {
  cover: string
  title: string
  subtitle?: string
  playCount?: number
  id?: number | string
  type?: 'playlist' | 'album' | 'artist'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'playlist',
})

const emit = defineEmits<{
  play: [id: number | string]
}>()

function handleClick() {
  const router = useRouter()
  if (props.id !== undefined) {
    router.push(`/${props.type}/${props.id}`)
  }
}

function handlePlay() {
  if (props.id !== undefined) {
    emit('play', props.id)
  }
}
</script>

<style scoped lang="scss">
.music-card {
  cursor: pointer;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-normal;

  &:hover {
    .card-overlay {
      opacity: 1;
    }

    .card-image {
      transform: scale(1.08);
    }
  }
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: $radius-lg;
  background: $bg-card;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  @include flex-center;
  opacity: 0;
  transition: opacity $transition-normal;

  .play-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: none;
    color: white;
    cursor: pointer;
    @include flex-center;
    transition: all $transition-fast;

    &:hover {
      background: $primary;
      transform: scale(1.1);
    }
  }
}

.card-play-count {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: $radius-full;
  font-size: 11px;
  color: white;
}

.card-info {
  padding: 8px 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
}

.card-subtitle {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 2px;
}
</style>
