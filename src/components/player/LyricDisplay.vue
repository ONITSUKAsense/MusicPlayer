<template>
  <div class="lyric-display" ref="lyricContainer">
    <div class="lyric-inner" :style="{ transform: `translateY(${offset}px)` }">
      <p
        v-for="(line, idx) in lyrics"
        :key="idx"
        class="lyric-line"
        :class="{ active: idx === activeIndex, past: idx < activeIndex }"
        :ref="(el) => { if (idx === activeIndex) activeLineEl = el as HTMLElement }"
      >
        {{ line.text || '...' }}
      </p>
    </div>
    <div v-if="lyrics.length === 0" class="lyric-empty">
      <Icon icon="carbon:music" width="32" height="32" />
      <p>暂无歌词</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { parseLyric } from '@/utils/format'

interface Props {
  lyric: string
  currentTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentTime: 0,
})

const lyrics = computed(() => parseLyric(props.lyric))
const activeIndex = ref(0)
const lyricContainer = ref<HTMLElement>()
const activeLineEl = ref<HTMLElement>()
const offset = ref(0)

watch(
  () => props.currentTime,
  (time) => {
    let idx = lyrics.value.length - 1
    for (let i = 0; i < lyrics.value.length; i++) {
      if (lyrics.value[i].time > time) {
        idx = i - 1
        break
      }
    }
    activeIndex.value = Math.max(0, idx)

    nextTick(() => {
      if (activeLineEl.value && lyricContainer.value) {
        const containerHeight = lyricContainer.value.clientHeight
        const lineTop = activeLineEl.value.offsetTop
        offset.value = containerHeight / 2 - lineTop - 20
      }
    })
  }
)
</script>

<style scoped lang="scss">
.lyric-display {
  height: 100%;
  overflow: hidden;
  position: relative;
  @include flex-center;
}

.lyric-inner {
  transition: transform 0.5s ease;
}

.lyric-line {
  text-align: center;
  font-size: 15px;
  color: $text-secondary;
  line-height: 2.4;
  padding: 4px 0;
  transition: all 0.3s ease;
  white-space: pre-wrap;

  &.past {
    color: rgba(255, 255, 255, 0.3);
    font-size: 13px;
  }

  &.active {
    color: $primary-light;
    font-size: 17px;
    font-weight: 600;
  }
}

.lyric-empty {
  @include flex-center;
  flex-direction: column;
  gap: 12px;
  color: $text-muted;
  font-size: 14px;
}
</style>
