<template>
  <div class="loading" :class="{ fullscreen }">
    <div class="loading-spinner">
      <div class="spinner-ring" />
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullscreen?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  fullscreen: false,
  text: '',
})
</script>

<style scoped lang="scss">
.loading {
  @include flex-center;
  padding: 40px;

  &.fullscreen {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 10, 0.7);
    backdrop-filter: blur(8px);
    z-index: 999;
  }
}

.loading-spinner {
  @include flex-center;
  flex-direction: column;
  gap: 16px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 13px;
  color: $text-secondary;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
