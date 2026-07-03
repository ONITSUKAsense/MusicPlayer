<template>
  <div class="lyric-display" ref="containerRef" @wheel="handleWheel">
    <div class="lyric-bg-glow" aria-hidden="true" />

    <div class="lyric-content" ref="contentRef">
      <!-- No lyrics message -->
      <div v-if="!hasLyrics" class="lyric-empty">
        <p v-if="!currentSong">选择歌曲开始播放</p>
        <p v-else>暂无歌词</p>
      </div>

      <!-- Lyric lines -->
      <template v-else>
        <div
          v-for="(line, idx) in lyricLines"
          :key="line.time"
          class="lyric-line"
          :class="{
            active: idx === currentLineIndex,
            past: idx < currentLineIndex,
            future: idx > currentLineIndex,
          }"
          :ref="(el) => { if (idx === currentLineIndex) currentLineRef = el as HTMLElement }"
        >
          {{ line.text }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { parseLyric } from '@/utils/format'
import type { LyricLine } from '@/types/music'

const playerStore = usePlayerStore()

const containerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const currentLineRef = ref<HTMLElement>()
const currentLineIdx = ref(-1)

const currentSong = computed(() => playerStore.currentSong)
const currentTime = computed(() => playerStore.currentTime)

const lyricLines = computed<LyricLine[]>(() => {
  const lyrics = currentSong.value?.lyrics
  if (!lyrics) return []
  return parseLyric(lyrics)
})

const hasLyrics = computed(() => lyricLines.value.length > 0)

// Determine current line index based on playback time
function updateCurrentLine() {
  const lines = lyricLines.value
  if (lines.length === 0) {
    currentLineIdx.value = -1
    return
  }

  const time = currentTime.value
  let idx = -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (time >= lines[i].time) {
      idx = i
      break
    }
  }
  currentLineIdx.value = idx
}

const currentLineIndex = computed(() => currentLineIdx.value)

// Scroll to current line
async function scrollToCurrentLine() {
  await nextTick()
  if (!currentLineRef.value || !containerRef.value) return
  currentLineRef.value.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

// Watch: current line changes → scroll
watch(currentLineIndex, () => {
  scrollToCurrentLine()
})

// Watch: current song changes → reset
watch(currentSong, () => {
  currentLineIdx.value = -1
})

// Periodically update line position during playback
watch(currentTime, () => {
  updateCurrentLine()
})

// Allow manual scrolling (prevents auto-scroll jump while user is browsing)
let userScrolling = false
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

function handleWheel() {
  userScrolling = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    userScrolling = false
    scrollToCurrentLine()
  }, 3000)
}
</script>

<style scoped lang="scss">
.lyric-display {
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: 20px 0;
  @include custom-scrollbar;

  // Hide scrollbar when not hovering
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.lyric-bg-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.lyric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.lyric-empty {
  text-align: center;
  color: $text-muted;
  font-size: 14px;
  padding: 60px 0;
}

.lyric-line {
  font-size: 15px;
  font-weight: 400;
  color: $text-muted;
  text-align: center;
  line-height: 1.6;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 2px 0;
  max-width: 480px;
  word-break: break-word;

  &.past {
    color: rgba(255, 255, 255, 0.3);
    font-size: 13px;
  }

  &.active {
    color: white;
    font-size: 17px;
    font-weight: 600;
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }

  &.future {
    font-size: 13px;
  }
}
</style>
