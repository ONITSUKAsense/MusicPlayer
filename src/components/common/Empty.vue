<template>
  <div class="empty-state">
    <div class="empty-icon">
      <Icon :icon="icon" width="48" height="48" />
    </div>
    <p class="empty-message">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'carbon:music',
  message: '暂无数据',
})
</script>

<style scoped lang="scss">
.empty-state {
  @include flex-center;
  flex-direction: column;
  padding: 60px 20px;
  gap: 16px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  @include flex-center;
  color: $text-muted;
}

.empty-message {
  font-size: 14px;
  color: $text-secondary;
}
</style>
