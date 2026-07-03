<template>
  <div class="artist-list-page">
    <h1 class="page-title">歌手</h1>
    <div class="artist-grid">
      <div
        v-for="artist in artists"
        :key="artist.id"
        class="artist-card"
        @click="goToArtist(artist.id)"
      >
        <div class="artist-avatar-wrapper">
          <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
        </div>
        <p class="artist-name">{{ artist.name }}</p>
        <p class="artist-genre">{{ artist.genre }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { musicApi } from '@/api/modules/music'
import type { Artist } from '@/types/music'

const router = useRouter()
const artists = ref<Artist[]>([])

onMounted(async () => {
  artists.value = await musicApi.getArtists()
})

function goToArtist(id: number) {
  router.push(`/artist/${id}`)
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 24px;
}

.artist-card {
  text-align: center; cursor: pointer; padding: 20px;
  border-radius: $radius-lg; transition: all $transition-normal;
  &:hover {
    background: $glass-light; transform: translateY(-4px);
    .artist-avatar { transform: scale(1.08); }
  }
}

.artist-avatar-wrapper {
  width: 120px; height: 120px; margin: 0 auto 12px;
  border-radius: 50%; overflow: hidden; box-shadow: $shadow-md;
}

.artist-avatar { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.artist-name { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.artist-genre { font-size: 12px; color: $text-secondary; }
</style>
