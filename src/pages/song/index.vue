<template>
  <div class="song-detail">
    <div v-if="loading" class="loading-state">
      <div class="skeleton-main" />
    </div>

    <template v-else-if="song">
      <div class="song-hero">
        <div class="song-cover-wrapper">
          <img :src="song.cover" :alt="song.title" class="song-cover" :class="{ spinning: isPlaying }" />
          <div class="cover-glow" />
        </div>
        <div class="song-info">
          <h1 class="song-title">{{ song.title }}</h1>
          <p class="song-artist" @click="goToArtist(song.artistId)">{{ song.artist }}</p>
          <p class="song-album" @click="goToAlbum(song.albumId)">{{ song.album }}</p>
          <div class="song-meta">
            <span>{{ formatTime(song.duration) }}</span>
            <span v-if="song.genre">{{ song.genre }}</span>
          </div>
          <div class="song-actions">
            <button class="action-btn primary" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
              <Icon :icon="isPlaying ? 'carbon:pause-filled' : 'carbon:play-filled-alt'" width="20" height="20" aria-hidden="true" />
              {{ isPlaying ? '暂停' : '播放' }}
            </button>
            <button class="action-btn" :class="{ liked: isLiked }" @click="isLiked = !isLiked" :aria-label="isLiked ? '取消喜欢' : '喜欢'">
              <Icon :icon="isLiked ? 'carbon:favorite-filled' : 'carbon:favorite'" width="18" height="18" aria-hidden="true" />
            </button>
            <button class="action-btn" @click="handleAddToPlaylist" aria-label="添加到播放列表">
              <Icon icon="carbon:add" width="18" height="18" aria-hidden="true" />
            </button>
            <button class="action-btn" @click="handleDownload" aria-label="下载">
              <Icon icon="carbon:download" width="18" height="18" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div class="song-content">
        <section class="lyric-section" v-if="parsedLyric.length > 0">
          <h2 class="section-title">歌词</h2>
          <div class="lyric-container" ref="lyricRef">
            <p
              v-for="(line, idx) in parsedLyric"
              :key="idx"
              class="lyric-line"
              :class="{ active: currentLyricIndex === idx }"
            >
              {{ line.text }}
            </p>
          </div>
        </section>

        <section class="comments-section">
          <h2 class="section-title">评论</h2>
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <img :src="comment.user.avatar" :alt="comment.user.nickname + '的头像'" class="comment-avatar" />
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-user">{{ comment.user.nickname }}</span>
                <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
              <div class="comment-actions">
                <span class="comment-likes">
                  <Icon icon="carbon:thumbs-up" width="14" height="14" />
                  {{ comment.likes }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <Empty v-else icon="carbon:music" message="歌曲不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import { formatTime, formatDate, parseLyric } from '@/utils/format'
import type { Song, Comment } from '@/types/music'
import Empty from '@/components/common/Empty.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const loading = ref(true)
const song = ref<Song | null>(null)
const comments = ref<Comment[]>([])
const isLiked = ref(false)
const lyricRef = ref<HTMLElement>()
const currentLyricIndex = ref(0)

const isPlaying = computed(() => playerStore.isPlaying && playerStore.currentSong?.id === song.value?.id)
const parsedLyric = computed(() => (song.value?.lyric ? parseLyric(song.value.lyric) : []))

onMounted(async () => {
  const id = Number(route.params.id) || 1
  try {
    song.value = await musicApi.getSongById(id)
    if (song.value) {
      comments.value = await musicApi.getComments(id)
      playerStore.playSong(song.value)
    }
  } finally {
    loading.value = false
  }
})

function togglePlay() {
  if (song.value) {
    if (playerStore.currentSong?.id === song.value.id) {
      playerStore.togglePlay()
    } else {
      playerStore.playSong(song.value)
    }
  }
}

function goToArtist(id: number) { router.push(`/artist/${id}`) }
function goToAlbum(id: number) { router.push(`/album/${id}`) }

function handleAddToPlaylist() {
  if (song.value) {
    playerStore.addToPlaylist(song.value)
    ElMessage.success('已添加到播放列表')
  }
}

function handleDownload() {
  ElMessage.info('下载功能开发中')
}
</script>

<style scoped lang="scss">
.song-hero {
  display: flex; gap: 40px; margin-bottom: 40px; align-items: center;
}

.song-cover-wrapper {
  position: relative; width: 240px; height: 240px; flex-shrink: 0;
}

.song-cover {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
  box-shadow: $shadow-lg;

  &.spinning { animation: vinyl-spin 8s linear infinite; }
}

.cover-glow {
  position: absolute; inset: -20px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.1), transparent);
  pointer-events: none;
}

.song-info { display: flex; flex-direction: column; justify-content: center; }

.song-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.song-artist { font-size: 16px; color: $text-secondary; margin-bottom: 4px; cursor: pointer;
  &:hover { color: $primary-light; }
}
.song-album { font-size: 14px; color: $text-muted; margin-bottom: 8px; cursor: pointer;
  &:hover { color: $primary-light; }
}
.song-meta { display: flex; gap: 12px; font-size: 13px; color: $text-muted; margin-bottom: 20px; }
.song-actions { display: flex; gap: 8px; }

.action-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: $radius-full; border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: $text-primary; font-size: 13px; cursor: pointer;
  transition: all $transition-fast;
  &:hover { background: rgba(255,255,255,0.08); }
  &.primary { background: $primary; border-color: $primary; color: white; &:hover { opacity: 0.9; } }
  &.liked { color: #ef4444; border-color: rgba(239,68,68,0.3); }
}

.song-content { max-width: 800px; }

.section { margin-bottom: 32px; }
.section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }

.lyric-container { padding: 16px 0; }
.lyric-line {
  font-size: 15px; color: $text-secondary; line-height: 2.2; transition: all $transition-fast;
  &.active { color: $primary-light; font-size: 17px; font-weight: 500; }
}

.comment-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.comment-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.comment-body { flex: 1; }
.comment-header { display: flex; gap: 8px; margin-bottom: 4px; }
.comment-user { font-size: 13px; font-weight: 500; }
.comment-time { font-size: 12px; color: $text-muted; }
.comment-content { font-size: 14px; line-height: 1.5; margin-bottom: 8px; }
.comment-actions { display: flex; gap: 16px; }
.comment-likes { display: flex; align-items: center; gap: 4px; font-size: 12px; color: $text-muted; }

.skeleton-main { height: 400px; @include skeleton; }

@include mobile {
  .song-hero { flex-direction: column; align-items: center; text-align: center; gap: 24px; }
  .song-cover-wrapper { width: 160px; height: 160px; }
  .song-actions { justify-content: center; flex-wrap: wrap; }
  .song-title { font-size: 22px; }
  .lyric-line { font-size: 14px; &.active { font-size: 15px; } }
}
</style>
