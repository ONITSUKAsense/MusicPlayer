<template>
  <div class="album-list-page">
    <h1 class="page-title">专辑</h1>
    <div class="album-grid">
      <div
        v-for="album in albums"
        :key="album.id"
        class="album-card"
        @click="goToAlbum(album.id)"
      >
        <div class="album-cover-wrapper">
          <img :src="album.cover" :alt="album.title" class="album-cover" />
          <div class="album-overlay">
            <Icon icon="carbon:play-filled-alt" width="24" height="24" />
          </div>
        </div>
        <p class="album-title truncate-1">{{ album.title }}</p>
        <p class="album-artist truncate-1">{{ album.artist }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { mockAlbums } from '@/mock/songs'
import type { Album } from '@/types/music'

const router = useRouter()
const albums = ref<Album[]>(mockAlbums)

function goToAlbum(id: number) {
  router.push(`/album/${id}`)
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.album-card {
  cursor: pointer; transition: all $transition-normal;
  &:hover {
    .album-cover { transform: scale(1.08); }
    .album-overlay { opacity: 1; }
  }
}

.album-cover-wrapper {
  position: relative; aspect-ratio: 1; border-radius: $radius-lg;
  overflow: hidden; background: $bg-card; margin-bottom: 8px;
}

.album-cover { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }

.album-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.3);
  @include flex-center; opacity: 0; transition: opacity $transition-normal; color: white;
}

.album-title { font-size: 14px; font-weight: 500; }
.album-artist { font-size: 12px; color: $text-secondary; margin-top: 2px; }
</style>
