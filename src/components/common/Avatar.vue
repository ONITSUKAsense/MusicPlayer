<template>
  <div class="avatar" :style="{ width: size + 'px', height: size + 'px' }" :class="{ clickable: !!clickable }" @click="$emit('click')">
    <img v-if="src" :src="src" :alt="alt" class="avatar-img" />
    <div v-else class="avatar-placeholder">
      <Icon icon="carbon:user-avatar" :width="size * 0.5" :height="size * 0.5" />
    </div>
    <div v-if="badge" class="avatar-badge" :class="badge">
      <Icon v-if="badge === 'vip'" icon="carbon:crown" width="10" height="10" />
      <Icon v-else icon="carbon:checkmark" width="10" height="10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  src?: string
  alt?: string
  size?: number
  badge?: 'vip' | 'verified' | ''
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 40,
  badge: '',
  clickable: false,
})

defineEmits<{ click: [] }>()
</script>

<style scoped lang="scss">
.avatar {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  &.clickable {
    cursor: pointer;
    transition: opacity $transition-fast;
    &:hover { opacity: 0.8; }
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-card;
  @include flex-center;
  color: $text-muted;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  @include flex-center;
  border: 2px solid $bg-dark;

  &.vip {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: white;
  }

  &.verified {
    background: $primary;
    color: white;
  }
}
</style>
