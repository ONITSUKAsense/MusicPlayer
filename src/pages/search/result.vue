<template>
  <div class="search-result-page">
    <h1 class="page-title">搜索结果: {{ keyword }}</h1>
    <div class="song-list">
      <SongItem v-for="(song, idx) in results" :key="song.id" :song="song" :index="idx + 1" show-cover show-album />
    </div>
    <Empty v-if="results.length === 0" message="未找到相关结果" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { musicApi } from '@/api/modules/music'
import type { Song } from '@/types/music'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const route = useRoute()
const keyword = ref(route.query.q as string || '')
const results = ref<Song[]>([])

onMounted(async () => {
  if (keyword.value) {
    const data = await musicApi.search(keyword.value)
    results.value = data.songs
  }
})
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.song-list { display: flex; flex-direction: column; gap: 4px; }
</style>
