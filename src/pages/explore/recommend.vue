<template>
  <div class="recommend-page">
    <h1 class="page-title">推荐音乐</h1>
    <div class="section">
      <h2 class="section-title">每日推荐</h2>
      <div class="song-list">
        <SongItem v-for="(song, idx) in songs" :key="song.id" :song="song" :index="idx + 1" show-cover show-album />
      </div>
    </div>
    <Empty v-if="songs.length === 0 && !loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { musicApi } from '@/api/modules/music'
import type { Song } from '@/types/music'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const songs = ref<Song[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await musicApi.getSongs()
    songs.value = data.list
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.section { margin-bottom: 32px; }
.section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.song-list { display: flex; flex-direction: column; gap: 4px; }
</style>
