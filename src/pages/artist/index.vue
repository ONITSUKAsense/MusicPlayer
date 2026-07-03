<template>
  <div class="artist-page">
    <div v-if="loading" class="loading-state">
      <div class="skeleton-header" />
      <div class="skeleton-list"><div v-for="i in 6" :key="i" class="skeleton-row" /></div>
    </div>

    <template v-else-if="artist">
      <div class="artist-header">
        <div class="artist-bg">
          <div class="bg-overlay" />
          <div class="artist-avatar-wrapper">
            <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
          </div>
        </div>
        <div class="artist-info">
          <h1 class="artist-name">{{ artist.name }}</h1>
          <p class="artist-bio">{{ artist.bio }}</p>
          <div class="artist-stats">
            <span>{{ formatCount(artist.songCount) }} 首歌</span>
            <span>{{ formatCount(artist.albumCount) }} 张专辑</span>
            <span>{{ formatCount(artist.followerCount) }} 粉丝</span>
          </div>
          <div class="artist-actions">
            <button class="action-btn primary" @click="playAllSongs" aria-label="播放全部歌曲">
              <Icon icon="carbon:play-filled-alt" width="18" height="18" aria-hidden="true" />
              播放全部
            </button>
            <button class="action-btn" @click="toggleFollow" :aria-label="artist.isFollowed ? '取消关注' : '关注'">
              <Icon :icon="artist.isFollowed ? 'carbon:user-check' : 'carbon:user-add'" width="18" height="18" aria-hidden="true" />
              {{ artist.isFollowed ? '已关注' : '关注' }}
            </button>
          </div>
        </div>
      </div>

      <div class="artist-content">
        <section class="section">
          <h2 class="section-title">热门歌曲</h2>
          <div class="song-list">
            <SongItem v-for="(song, idx) in artistSongs" :key="song.id" :song="song" :index="idx + 1" show-cover show-album />
          </div>
        </section>
      </div>
    </template>

    <Empty v-else icon="carbon:user-avatar" message="歌手不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import { formatCount } from '@/utils/format'
import { mockSongs } from '@/mock/songs'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const route = useRoute()
const playerStore = usePlayerStore()
const loading = ref(true)
const artist = ref<any>(null)
const artistSongs = ref<any[]>([])

onMounted(async () => {
  const id = Number(route.params.id) || 2
  try {
    artist.value = await musicApi.getArtistById(id)
    if (artist.value) {
      artistSongs.value = mockSongs.filter((s) => s.artistId === id)
    }
  } finally {
    loading.value = false
  }
})

function playAllSongs() {
  if (artistSongs.value.length > 0) playerStore.playPlaylist(artistSongs.value)
}

function toggleFollow() {
  if (artist.value) artist.value.isFollowed = !artist.value.isFollowed
}
</script>

<style scoped lang="scss">
.artist-header { position: relative; margin-bottom: 32px; }

.artist-bg {
  height: 200px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: $radius-xl;
  position: relative; overflow: hidden;
  .bg-overlay { position: absolute; inset: 0; background: linear-gradient(to top, $bg-dark, transparent); }
}

.artist-avatar-wrapper {
  position: absolute; bottom: -60px; left: 32px;
  width: 140px; height: 140px; border-radius: 50%; overflow: hidden;
  border: 4px solid $bg-dark; box-shadow: $shadow-lg;
}

.artist-avatar { width: 100%; height: 100%; object-fit: cover; }

.artist-info { padding: 80px 0 0; }
.artist-name { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
.artist-bio { color: $text-secondary; font-size: 14px; margin-bottom: 12px; }
.artist-stats { display: flex; gap: 16px; font-size: 13px; color: $text-muted; margin-bottom: 16px; }
.artist-actions { display: flex; gap: 8px; }

.action-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 20px;
  border-radius: $radius-full; border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: $text-primary; font-size: 13px; cursor: pointer;
  transition: all $transition-fast;
  &:hover { background: rgba(255,255,255,0.08); }
  &.primary { background: $primary; border-color: $primary; color: white; &:hover { opacity: 0.9; } }
}

.section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.song-list { display: flex; flex-direction: column; gap: 4px; }

.loading-state { display: flex; flex-direction: column; gap: 24px; }
.skeleton-header { height: 200px; @include skeleton; }
.skeleton-list { display: flex; flex-direction: column; gap: 8px; }
.skeleton-row { height: 52px; @include skeleton; }
</style>
