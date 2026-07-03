<template>
  <div class="messages-page">
    <h1 class="page-title">消息中心</h1>
    <Empty icon="carbon:notification" message="暂无消息" />
  </div>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue'
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
</style>
