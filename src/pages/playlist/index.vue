<template>
  <div class="playlist-page">
    <div v-if="loading" class="loading-state">
      <div class="skeleton-header" />
      <div class="skeleton-list">
        <div v-for="i in 8" :key="i" class="skeleton-row" />
      </div>
    </div>

    <template v-else-if="playlist">
      <div class="playlist-header">
        <div class="playlist-cover">
          <img :src="playlist.cover" :alt="playlist.name" />
        </div>
        <div class="playlist-info">
          <span class="playlist-tag">歌单</span>
          <h1 class="playlist-name">{{ playlist.name }}</h1>
          <p class="playlist-creator">
            <img :src="playlist.creator.avatar" class="creator-avatar" />
            {{ playlist.creator.name }}
          </p>
          <p class="playlist-desc">{{ playlist.description }}</p>
          <div class="playlist-stats">
            <span>{{ formatCount(playlist.playCount) }} 次播放</span>
            <span>{{ playlist.songCount }} 首歌曲</span>
          </div>
          <div class="playlist-actions">
            <button class="action-btn primary" @click="playAll" aria-label="播放全部">
              <Icon icon="carbon:play-filled-alt" width="18" height="18" aria-hidden="true" />
              播放全部
            </button>
            <button class="action-btn" :class="{ liked: isFavorited }" @click="toggleFavorite" :aria-label="isFavorited ? '取消收藏' : '收藏歌单'">
              <Icon :icon="isFavorited ? 'carbon:favorite-filled' : 'carbon:favorite'" width="18" height="18" aria-hidden="true" />
              {{ isFavorited ? '已收藏' : '收藏' }}
            </button>
            <button class="action-btn" @click="handleShare" aria-label="分享">
              <Icon icon="carbon:share" width="18" height="18" aria-hidden="true" />
              分享
            </button>
          </div>
          <div class="playlist-tags" v-if="playlist.tags.length > 0">
            <span v-for="tag in playlist.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="playlist-songs">
        <div class="songs-header">
          <span class="col-index">#</span>
          <span class="col-title">标题</span>
          <span class="col-artist">歌手</span>
          <span class="col-album">专辑</span>
          <span class="col-duration">时长</span>
        </div>
        <SongItem
          v-for="(song, idx) in playlist.songs"
          :key="song.id"
          :song="song"
          :index="idx + 1"
          show-cover
          show-album
        />
      </div>
    </template>

    <Empty v-else icon="carbon:playlist" message="歌单不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import { formatCount } from '@/utils/format'
import type { Playlist } from '@/types/music'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const playerStore = usePlayerStore()
const loading = ref(true)
const playlist = ref<Playlist | null>(null)
const isFavorited = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) {
    try {
      playlist.value = await musicApi.getPlaylistById(id)
    } finally {
      loading.value = false
    }
  } else {
    // Show all playlists
    const playlists = await musicApi.getPlaylists()
    if (playlists.length > 0) {
      playlist.value = playlists[0]
    }
    loading.value = false
  }
})

function playAll() {
  if (playlist.value) playerStore.playPlaylist(playlist.value.songs)
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
  ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
}

function handleShare() {
  ElMessage.info('分享功能开发中')
}
</script>

<style scoped lang="scss">
.playlist-header {
  display: flex; gap: 32px; margin-bottom: 32px;
}

.playlist-cover {
  width: 220px; height: 220px; border-radius: $radius-xl; overflow: hidden; flex-shrink: 0;
  box-shadow: $shadow-lg;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.playlist-info { display: flex; flex-direction: column; justify-content: flex-end; min-width: 0; }

.playlist-tag {
  font-size: 12px; font-weight: 600; color: $primary-light; text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 8px;
}

.playlist-name { font-size: 28px; font-weight: 700; margin-bottom: 8px; }

.playlist-creator {
  display: flex; align-items: center; gap: 8px; font-size: 14px; color: $text-secondary; margin-bottom: 8px;
}
.creator-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }

.playlist-desc { font-size: 14px; color: $text-secondary; margin-bottom: 12px; }

.playlist-stats { display: flex; gap: 16px; font-size: 13px; color: $text-muted; margin-bottom: 16px; }

.playlist-actions { display: flex; gap: 8px; margin-bottom: 12px; }

.action-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: $radius-full; border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: $text-primary; font-size: 13px;
  cursor: pointer; transition: all $transition-fast;
  &:hover { background: rgba(255,255,255,0.08); }
  &.primary { background: $primary; border-color: $primary; color: white;
    &:hover { opacity: 0.9; }
  }
  &.liked { color: #ef4444; border-color: rgba(239,68,68,0.3); }
}

.playlist-tags { display: flex; gap: 6px; }
.tag { font-size: 12px; color: $text-secondary; padding: 4px 10px; border-radius: $radius-full; background: rgba(255,255,255,0.05); }

.playlist-songs { margin-top: 24px; }
.songs-header {
  display: grid; grid-template-columns: 40px 1fr 1fr 1fr 60px; gap: 12px;
  padding: 8px 12px; font-size: 12px; color: $text-muted;
  border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 8px;
}

.loading-state { display: flex; flex-direction: column; gap: 24px; }
.skeleton-header { height: 220px; @include skeleton; }
.skeleton-list { display: flex; flex-direction: column; gap: 8px; }
.skeleton-row { height: 52px; @include skeleton; }

@include mobile {
  .playlist-header { flex-direction: column; align-items: center; text-align: center; gap: 20px; }
  .playlist-cover { width: 160px; height: 160px; }
  .playlist-info { align-items: center; }
  .playlist-name { font-size: 22px; }
  .playlist-actions { justify-content: center; flex-wrap: wrap; }
  .playlist-tags { justify-content: center; }
  .songs-header { display: none; }
}
</style>
