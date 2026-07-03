<template>
  <div class="skeleton" :class="[variant, shape]" :style="customStyle">
    <div class="skeleton-shimmer" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  shape?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rectangular',
})

const customStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))
</script>

<style scoped lang="scss">
.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;

  &.text {
    height: 14px;
    border-radius: $radius-sm;
  }

  &.circular {
    border-radius: 50%;
  }

  &.card {
    aspect-ratio: 1;
  }
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
</style>
