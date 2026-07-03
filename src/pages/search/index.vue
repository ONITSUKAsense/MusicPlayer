<template>
  <div class="search-page">
    <div class="search-hero">
      <div class="search-box-wrapper">
        <Icon icon="carbon:search" width="20" height="20" class="search-icon" />
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索歌曲、歌手、专辑..."
          aria-label="搜索关键词"
          @input="handleSearch"
          @keyup.enter="doSearch"
          ref="searchInput"
        />
        <button v-if="keyword" class="clear-btn" @click="clearSearch" aria-label="清除搜索">
          <Icon icon="carbon:close" width="18" height="18" aria-hidden="true" />
        </button>
      </div>
      <div class="search-hints">
        <span class="hint-label">热门搜索：</span>
        <button
          v-for="hot in hotSearch"
          :key="hot"
          class="hint-tag"
          aria-label="搜索 {{ hot }}"
          @click="keyword = hot; doSearch()"
        >
          {{ hot }}
        </button>
      </div>
    </div>

    <div v-if="!keyword" class="search-initial">
      <div class="history-section" v-if="searchHistory.length > 0">
        <div class="section-header">
          <h3>搜索历史</h3>
          <button class="clear-history" @click="clearHistory">清空</button>
        </div>
        <div class="history-tags">
          <span
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            @click="keyword = item; doSearch()"
          >
            <Icon icon="carbon:time" width="14" height="14" />
            {{ item }}
          </span>
        </div>
      </div>

      <div class="hot-section">
        <h3>热门搜索</h3>
        <div class="hot-list">
          <div v-for="(item, idx) in hotList" :key="idx" class="hot-item" @click="keyword = item; doSearch()">
            <span class="hot-rank" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
            <span class="hot-name">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="search-results">
      <div class="result-tabs" role="tablist" aria-label="搜索结果分类">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          role="tab"
          :aria-selected="activeTab === tab.key"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="search-loading">
        <div v-for="i in 5" :key="i" class="skeleton-row" />
      </div>

      <div v-else-if="searchResults.songs.length > 0 && activeTab === 'songs'" class="song-results">
        <div class="result-header">
          <span class="col-index">#</span>
          <span class="col-title">标题</span>
          <span class="col-artist">歌手</span>
          <span class="col-album">专辑</span>
          <span class="col-duration">时长</span>
        </div>
        <SongItem
          v-for="(song, idx) in searchResults.songs"
          :key="song.id"
          :song="song"
          :index="idx + 1"
          show-cover
          show-album
        />
      </div>

      <div v-else-if="searchResults.artists.length > 0 && activeTab === 'artists'" class="artist-results">
        <div
          v-for="artist in searchResults.artists"
          :key="artist.id"
          class="artist-result-item"
          @click="goToArtist(artist.id)"
        >
          <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
          <div class="artist-info">
            <p class="artist-name">{{ artist.name }}</p>
            <p class="artist-desc">{{ artist.bio }}</p>
          </div>
        </div>
      </div>

      <Empty v-else message="未找到相关结果" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { musicApi } from '@/api/modules/music'
import type { SearchResult } from '@/types/music'
import { storage } from '@/utils/storage'
import SongItem from '@/components/common/SongItem.vue'
import Empty from '@/components/common/Empty.vue'

const router = useRouter()
const searchInput = ref<HTMLInputElement>()
const keyword = ref('')
const loading = ref(false)
const activeTab = ref('songs')
const searchHistory = ref<string[]>(storage.get<string[]>('search-history') || [])

const hotSearch = ['周杰伦', '邓紫棋', '陈奕迅', '起风了', '孤勇者']
const hotList = ['起风了', '光年之外', '孤勇者', '泡沫', '成都', '平凡之路', 'Perfect', '夜曲', '晴天', 'Shape of You']

const tabs = [
  { key: 'songs', label: '歌曲' },
  { key: 'artists', label: '歌手' },
]

const searchResults = reactive<SearchResult>({
  songs: [],
  artists: [],
  albums: [],
  playlists: [],
})

let searchTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  nextTick(() => searchInput.value?.focus())
})

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  if (!keyword.value.trim()) return
  searchTimer = setTimeout(doSearch, 400)
}

async function doSearch() {
  if (!keyword.value.trim()) return
  loading.value = true

  try {
    const result = await musicApi.search(keyword.value)
    Object.assign(searchResults, result)
    addToHistory(keyword.value)
  } catch {
    searchResults.songs = []
    searchResults.artists = []
  } finally {
    loading.value = false
  }
}

function addToHistory(key: string) {
  const list = searchHistory.value.filter((h) => h !== key)
  list.unshift(key)
  if (list.length > 10) list.pop()
  searchHistory.value = list
  storage.set('search-history', list)
}

function clearHistory() {
  searchHistory.value = []
  storage.remove('search-history')
}

function clearSearch() {
  keyword.value = ''
  searchResults.songs = []
  searchResults.artists = []
  searchInput.value?.focus()
}

function goToArtist(id: number) {
  router.push(`/artist/${id}`)
}
</script>

<style scoped lang="scss">
.search-page {
  max-width: 900px;
  margin: 0 auto;
}

.search-hero {
  margin-bottom: 32px;
}

.search-box-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius-full;
  transition: all $transition-fast;

  &:focus-within {
    border-color: $primary;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
  }
}

.search-icon {
  color: $text-muted;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: $text-primary;
  font-size: 16px;

  &::placeholder {
    color: $text-muted;
  }
}

.clear-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: $text-secondary;
  cursor: pointer;
  @include flex-center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.search-hints {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.hint-label {
  font-size: 12px;
  color: $text-muted;
}

.hint-tag {
  font-size: 12px;
  color: $text-secondary;
  padding: 4px 12px;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $primary;
    color: white;
  }
}

// Initial state
.search-initial {
  display: grid;
  gap: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h3 { font-size: 16px; font-weight: 600; }
}

.clear-history {
  font-size: 12px;
  color: $text-secondary;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { color: #ef4444; }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: $text-secondary;
  padding: 6px 14px;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $text-primary;
  }
}

.hot-section {
  h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
}

.hot-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover { background: $glass-light; }
}

.hot-rank {
  width: 24px;
  font-size: 14px;
  font-weight: 600;
  color: $text-muted;
  text-align: center;

  &.top { color: $primary-light; }
}

.hot-name {
  font-size: 14px;
}

// Results
.result-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 6px 16px;
  border-radius: $radius-full;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: $text-secondary;
  font-size: 13px;
  cursor: pointer;
  transition: all $transition-fast;

  &.active {
    background: $primary;
    color: white;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.result-header {
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr 60px;
  gap: 12px;
  padding: 8px 12px;
  font-size: 12px;
  color: $text-muted;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 8px;
}

.artist-result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover { background: $glass-light; }
}

.artist-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.artist-info { min-width: 0; }
.artist-name { font-size: 15px; font-weight: 500; }
.artist-desc { font-size: 13px; color: $text-secondary; margin-top: 4px; }

.search-loading { display: flex; flex-direction: column; gap: 8px; }

.skeleton-row {
  height: 52px;
  @include skeleton;
}

@include mobile {
  .search-box-wrapper {
    padding: 10px 14px;
  }

  .search-input {
    font-size: 14px;
  }

  .hot-list {
    grid-template-columns: 1fr;
  }

  .result-header {
    grid-template-columns: 30px 1fr 60px;
    .col-album { display: none; }
  }

  .artist-avatar {
    width: 44px;
    height: 44px;
  }
}
</style>
