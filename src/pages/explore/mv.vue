<template>
  <div class="mv-page">
    <h1 class="page-title">MV专区</h1>
    <div class="mv-grid">
      <div v-for="i in 6" :key="i" class="mv-card glass-card" @click="handleComingSoon">
        <div class="mv-cover">
          <img :src="`https://picsum.photos/seed/mv${i}/400/225`" alt="" />
          <div class="mv-play">
            <Icon icon="carbon:play-filled-alt" width="32" height="32" />
          </div>
          <span class="mv-duration">03:45</span>
        </div>
        <div class="mv-info">
          <h3 class="mv-title truncate-1">MV 示例 {{ i }}</h3>
          <p class="mv-artist truncate-1">艺术家</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'

function handleComingSoon() {
  ElMessage.info('MV播放功能开发中')
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.mv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
.mv-card { overflow: hidden; cursor: pointer; }
.mv-cover { position: relative; aspect-ratio: 16/9; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  &:hover {
    img { transform: scale(1.05); }
    .mv-play { opacity: 1; }
  }
}
.mv-play { position: absolute; inset: 0; background: rgba(0,0,0,0.3); @include flex-center; opacity: 0; transition: opacity $transition-normal; color: white; }
.mv-duration { position: absolute; bottom: 8px; right: 8px; font-size: 12px; color: white; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: $radius-sm; }
.mv-info { padding: 12px; }
.mv-title { font-size: 14px; font-weight: 500; }
.mv-artist { font-size: 12px; color: $text-secondary; margin-top: 4px; }
</style>
