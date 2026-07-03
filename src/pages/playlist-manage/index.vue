<template>
  <div class="my-playlists">
    <div class="page-header">
      <h1 class="page-title">我的歌单</h1>
      <router-link to="/my/playlists/create" class="create-btn">
        <Icon icon="carbon:add" width="18" height="18" />
        创建歌单
      </router-link>
    </div>

    <div class="playlist-grid">
      <MusicCard
        v-for="pl in playlists"
        :key="pl.id"
        :cover="pl.cover"
        :title="pl.name"
        :subtitle="pl.description"
        :id="pl.id"
        type="playlist"
        @play="handlePlay"
      />
    </div>
    <Empty v-if="playlists.length === 0" icon="carbon:playlist" message="还没有创建歌单" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import type { Playlist } from '@/types/music'
import MusicCard from '@/components/common/MusicCard.vue'
import Empty from '@/components/common/Empty.vue'

const playerStore = usePlayerStore()
const playlists = ref<Playlist[]>([])

onMounted(async () => {
  playlists.value = await musicApi.getPlaylists()
})

function handlePlay(id: number | string) {
  const pl = playlists.value.find((p) => p.id === Number(id))
  if (pl) playerStore.playPlaylist(pl.songs)
}
</script>

<style scoped lang="scss">
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; }
.create-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 20px;
  background: $primary; color: white; border-radius: $radius-full; text-decoration: none;
  font-size: 13px; font-weight: 500; transition: all $transition-fast;
  &:hover { opacity: 0.9; }
}
.playlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
</style>
