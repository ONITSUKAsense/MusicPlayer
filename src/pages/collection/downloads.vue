<template>
  <div class="downloads-page">
    <h1 class="page-title">下载管理</h1>
    <Empty icon="carbon:download" message="暂无下载内容" />
  </div>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue'
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
</style>
