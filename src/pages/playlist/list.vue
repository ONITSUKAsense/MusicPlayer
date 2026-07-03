<template>
  <div class="playlist-list-page">
    <h1 class="page-title">全部歌单</h1>

    <div class="playlist-grid">
      <MusicCard
        v-for="pl in playlists"
        :key="pl.id"
        :cover="pl.cover"
        :title="pl.name"
        :subtitle="pl.description"
        :play-count="pl.playCount"
        :id="pl.id"
        type="playlist"
        @play="handlePlay"
      />
    </div>

    <div v-if="loading" class="loading-grid">
      <div v-for="i in 8" :key="i" class="skeleton-card" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import type { Playlist } from '@/types/music'
import MusicCard from '@/components/common/MusicCard.vue'

const playerStore = usePlayerStore()
const playlists = ref<Playlist[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    playlists.value = await musicApi.getPlaylists()
  } finally {
    loading.value = false
  }
})

function handlePlay(id: number | string) {
  const pl = playlists.value.find((p) => p.id === Number(id))
  if (pl) playerStore.playPlaylist(pl.songs)
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.skeleton-card {
  aspect-ratio: 1;
  @include skeleton;
}
</style>
