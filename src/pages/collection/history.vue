<template>
  <div class="history-page">
    <h1 class="page-title">最近播放</h1>
    <div class="song-list">
      <SongItem
        v-for="(song, idx) in songs"
        :key="song.id"
        :song="song"
        :index="idx + 1"
        show-cover
        show-album
      />
    </div>
    <Empty v-if="songs.length === 0" icon="carbon:time" message="暂无播放记录" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { musicApi } from '@/api/modules/music'
import type { Song } from '@/types/music'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const songs = ref<Song[]>([])

onMounted(async () => {
  const data = await musicApi.getSongs()
  songs.value = data.list.slice(0, 5)
})
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.song-list { display: flex; flex-direction: column; gap: 4px; }
</style>
