<template>
  <div class="album-page">
    <div v-if="loading"><div class="skeleton-header" /><div v-for="i in 5" :key="i" class="skeleton-row" /></div>
    <template v-else-if="album">
      <div class="album-header">
        <div class="album-cover">
          <img :src="album.cover" :alt="album.title" />
          <div class="album-overlay" @click="playAll">
            <Icon icon="carbon:play-filled-alt" width="40" height="40" />
          </div>
        </div>
        <div class="album-info">
          <span class="album-tag">专辑</span>
          <h1 class="album-title">{{ album.title }}</h1>
          <p class="album-artist">{{ album.artist }}</p>
          <p class="album-meta">{{ album.releaseDate }} · {{ album.songCount }} 首</p>
          <button class="play-all-btn" @click="playAll">
            <Icon icon="carbon:play-filled-alt" width="18" height="18" />
            播放全部
          </button>
        </div>
      </div>
      <div class="album-songs">
        <SongItem v-for="(song, idx) in album.songs" :key="song.id" :song="song" :index="idx + 1" show-cover show-album />
      </div>
    </template>
    <Empty v-else icon="carbon:album" message="专辑不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const route = useRoute()
const playerStore = usePlayerStore()
const loading = ref(true)
const album = ref<any>(null)

onMounted(async () => {
  const id = Number(route.params.id) || 1
  try {
    album.value = await musicApi.getAlbumById(id)
  } finally {
    loading.value = false
  }
})

function playAll() {
  if (album.value?.songs.length > 0) playerStore.playPlaylist(album.value.songs)
}
</script>

<style scoped lang="scss">
.album-header { display: flex; gap: 32px; margin-bottom: 32px; }
.album-cover {
  width: 200px; height: 200px; border-radius: $radius-xl; overflow: hidden; flex-shrink: 0;
  position: relative; box-shadow: $shadow-lg;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.album-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4); @include flex-center; opacity: 0;
  transition: opacity $transition-normal; cursor: pointer; color: white;
  &:hover { opacity: 1; }
}
.album-info { display: flex; flex-direction: column; justify-content: flex-end; }
.album-tag { font-size: 12px; font-weight: 600; color: $primary-light; text-transform: uppercase; margin-bottom: 8px; }
.album-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.album-artist { font-size: 15px; color: $text-secondary; margin-bottom: 4px; cursor: pointer;
  &:hover { color: $primary-light; }
}
.album-meta { font-size: 13px; color: $text-muted; margin-bottom: 16px; }
.play-all-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 20px; width: fit-content;
  border-radius: $radius-full; border: none; background: $primary; color: white;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: all $transition-fast;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
}
.skeleton-header { height: 200px; @include skeleton; margin-bottom: 24px; }
.skeleton-row { height: 52px; @include skeleton; margin-bottom: 8px; }
</style>
