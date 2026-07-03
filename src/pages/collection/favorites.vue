<template>
  <div class="favorites-page">
    <h1 class="page-title">收藏</h1>
    <Empty icon="carbon:favorite" message="还没有收藏的内容" />
  </div>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue'
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
</style>
