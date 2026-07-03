<template>
  <div class="charts-page">
    <h1 class="page-title">热门榜单</h1>
    <div v-if="loading" class="loading-skeleton">
      <div v-for="i in 3" :key="i" class="skeleton-chart" />
    </div>
    <div v-else class="charts-list">
      <div v-for="chart in charts" :key="chart.id" class="chart-card glass-card">
        <div class="chart-header">
          <div class="chart-cover">
            <img :src="chart.cover" :alt="chart.name" />
          </div>
          <div class="chart-info">
            <h2 class="chart-name">{{ chart.name }}</h2>
            <p class="chart-date">更新于 {{ chart.updateDate }}</p>
            <button class="play-all-btn" @click="playAll(chart.songs)" :aria-label="'播放全部 ' + chart.name">
              <Icon icon="carbon:play-filled-alt" width="16" height="16" aria-hidden="true" />
              播放全部
            </button>
          </div>
        </div>
        <div class="chart-songs">
          <SongItem
            v-for="(song, idx) in chart.songs.slice(0, 10)"
            :key="song.id"
            :song="song"
            :index="idx + 1"
            show-album
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import type { Song } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import SongItem from '@/components/common/SongItem.vue'

const playerStore = usePlayerStore()
const loading = ref(true)
const charts = ref<any[]>([])

onMounted(async () => {
  try {
    charts.value = await musicApi.getCharts()
  } finally {
    loading.value = false
  }
})

function playAll(songs: Song[]) {
  if (songs.length > 0) playerStore.playPlaylist(songs)
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }

.charts-list { display: flex; flex-direction: column; gap: 24px; }

.chart-card { padding: 24px; }

.chart-header {
  display: flex; gap: 20px; margin-bottom: 20px; padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chart-cover {
  width: 160px; height: 160px; border-radius: $radius-lg; overflow: hidden; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.chart-info {
  display: flex; flex-direction: column; justify-content: flex-end;
}

.chart-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.chart-date { font-size: 13px; color: $text-secondary; margin-bottom: 12px; }

.play-all-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 20px;
  border-radius: $radius-full; border: none; background: $primary; color: white;
  font-size: 13px; font-weight: 500; cursor: pointer; width: fit-content;
  transition: all $transition-fast;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
}

.loading-skeleton { display: flex; flex-direction: column; gap: 24px; }
.skeleton-chart { height: 400px; @include skeleton; }
</style>
