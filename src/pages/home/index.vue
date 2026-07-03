<template>
  <div class="home">
    <!-- Hero Banner -->
    <section class="banner-section" aria-label="推荐横幅">
      <div class="banner-carousel" role="region" aria-roledescription="carousel" aria-label="推荐内容轮播">
        <div
          v-for="(banner, idx) in banners"
          :key="banner.id"
          class="banner-slide"
          :class="{ active: idx === currentBanner }"
          role="group"
          aria-roledescription="slide"
          :aria-label="'横幅 ' + (idx + 1) + ': ' + banner.title"
          @click="handleBannerClick(banner)"
        >
          <img :src="banner.image" :alt="banner.title" class="banner-image" />
          <div class="banner-overlay">
            <h2 class="banner-title">{{ banner.title }}</h2>
          </div>
        </div>
      </div>
      <div class="banner-dots" role="tablist" aria-label="横幅导航">
        <button
          v-for="(_, idx) in banners"
          :key="idx"
          class="dot"
          :class="{ active: idx === currentBanner }"
          role="tab"
          :aria-selected="idx === currentBanner"
          :aria-label="'横幅 ' + (idx + 1)"
          @click="currentBanner = idx"
        />
      </div>
    </section>

    <!-- Daily Recommend -->
    <section class="section" aria-label="每日推荐">
      <div class="section-header">
        <h2 class="section-title">每日推荐</h2>
        <router-link to="/explore/recommend" class="section-more" aria-label="查看更多每日推荐">查看更多</router-link>
      </div>
      <div class="song-list-horizontal">
        <div
          v-for="song in dailyRecommend"
          :key="song.id"
          class="song-card"
          role="button"
          tabindex="0"
          :aria-label="'播放 ' + song.title + ' - ' + song.artist"
          @click="playSong(song)"
          @keydown.enter="playSong(song)"
          @keydown.space.prevent="playSong(song)"
        >
          <div class="song-card-cover">
            <img :src="song.cover" :alt="song.title" />
            <div class="song-card-overlay" aria-hidden="true">
              <Icon icon="carbon:play-filled-alt" width="24" height="24" aria-hidden="true" />
            </div>
          </div>
          <div class="song-card-info">
            <p class="song-card-title truncate-1">{{ song.title }}</p>
            <p class="song-card-artist truncate-1">{{ song.artist }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Hot Playlists -->
    <section class="section" aria-label="热门歌单">
      <div class="section-header">
        <h2 class="section-title">热门歌单</h2>
        <router-link to="/playlist/0" class="section-more" aria-label="查看更多歌单">查看更多</router-link>
      </div>
      <div class="card-grid">
        <MusicCard
          v-for="pl in hotPlaylists"
          :key="pl.id"
          :cover="pl.cover"
          :title="pl.name"
          :subtitle="pl.description"
          :play-count="pl.playCount"
          :id="pl.id"
          type="playlist"
          @play="handlePlayPlaylist"
        />
      </div>
    </section>

    <!-- Hot Artists -->
    <section class="section" aria-label="热门歌手">
      <div class="section-header">
        <h2 class="section-title">热门歌手</h2>
        <router-link to="/artist/0" class="section-more" aria-label="查看更多歌手">查看更多</router-link>
      </div>
      <div class="artist-grid">
        <div
          v-for="artist in hotArtists"
          :key="artist.id"
          class="artist-card"
          role="button"
          tabindex="0"
          :aria-label="'查看歌手 ' + artist.name"
          @click="goToArtist(artist.id)"
          @keydown.enter="goToArtist(artist.id)"
          @keydown.space.prevent="goToArtist(artist.id)"
        >
          <div class="artist-avatar-wrapper">
            <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
          </div>
          <p class="artist-name">{{ artist.name }}</p>
          <p class="artist-genre">{{ artist.genre }}</p>
        </div>
      </div>
    </section>

    <!-- Loading skeleton -->
    <div v-if="loading" class="loading-skeleton">
      <div v-for="i in 6" :key="i" class="skeleton-card" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import type { Song, Playlist, Artist } from '@/types/music'
import { usePlayerStore } from '@/stores/player'
import MusicCard from '@/components/common/MusicCard.vue'

const router = useRouter()
const playerStore = usePlayerStore()

const loading = ref(true)
const banners = ref<Array<{ id: number; image: string; title: string; link: string }>>([])
const dailyRecommend = ref<Song[]>([])
const hotPlaylists = ref<Playlist[]>([])
const hotArtists = ref<Artist[]>([])
const currentBanner = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    const data = await musicApi.getHomeData()
    banners.value = data.banners
    dailyRecommend.value = data.dailyRecommend
    hotPlaylists.value = data.hotPlaylists
    hotArtists.value = data.hotArtists
  } catch {
    // Fallback to empty state
  } finally {
    loading.value = false
  }

  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 4000)
})

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer)
})

function handleBannerClick(banner: { id: number; link: string }) {
  if (banner.link) router.push(banner.link)
}

function playSong(song: Song) {
  playerStore.playSong(song)
}

function handlePlayPlaylist(id: number | string) {
  const pl = hotPlaylists.value.find((p) => p.id === Number(id))
  if (pl) {
    playerStore.playPlaylist(pl.songs)
  }
}

function goToArtist(id: number) {
  router.push(`/artist/${id}`)
}
</script>

<style scoped lang="scss">
.home {
  max-width: 1400px;
  margin: 0 auto;
}

// Banner
.banner-section {
  position: relative;
  border-radius: $radius-xl;
  overflow: hidden;
  margin-bottom: 36px;
  height: 240px;

  @include mobile {
    height: 160px;
    border-radius: $radius-lg;
    margin-bottom: 20px;
  }
}

.banner-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
  cursor: pointer;

  &.active {
    opacity: 1;
  }
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 32px 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.banner-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.banner-dots {
  position: absolute;
  bottom: 16px;
  right: 24px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all $transition-fast;

  &.active {
    width: 20px;
    border-radius: 3px;
    background: white;
  }
}

// Sections
.section {
  margin-bottom: 36px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
}

.section-more {
  font-size: 13px;
  color: $text-secondary;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $primary-light;
  }
}

// Song list horizontal
.song-list-horizontal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.song-card {
  cursor: pointer;
  border-radius: $radius-md;
  overflow: hidden;
  transition: all $transition-normal;

  &:hover {
    .song-card-overlay {
      opacity: 1;
    }

    .song-card-cover img {
      transform: scale(1.08);
    }
  }
}

.song-card-cover {
  position: relative;
  aspect-ratio: 1;
  border-radius: $radius-md;
  overflow: hidden;
  background: $bg-card;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.song-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  @include flex-center;
  opacity: 0;
  transition: opacity $transition-normal;
  color: white;
}

.song-card-info {
  padding: 8px 4px;
}

.song-card-title {
  font-size: 14px;
  font-weight: 500;
}

.song-card-artist {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 2px;
}

// Card grid
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

// Artist grid
.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.artist-card {
  text-align: center;
  cursor: pointer;
  padding: 16px;
  border-radius: $radius-lg;
  transition: all $transition-normal;

  &:hover {
    background: $glass-light;
    transform: translateY(-4px);

    .artist-avatar {
      transform: scale(1.08);
    }
  }
}

.artist-avatar-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto 12px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.artist-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.artist-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.artist-genre {
  font-size: 12px;
  color: $text-secondary;
}

// Skeleton
.loading-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.skeleton-card {
  aspect-ratio: 1;
  @include skeleton;
}
</style>
