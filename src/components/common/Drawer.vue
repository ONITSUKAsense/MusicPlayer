<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="drawer-overlay" @click.self="close" />
    </Transition>
    <Transition :name="position === 'right' ? 'drawer-slide-right' : 'drawer-slide-bottom'">
      <div v-if="modelValue" class="drawer" :class="position" :style="{ width: position === 'right' ? width : '100%' }">
        <div class="drawer-header">
          <h3 class="drawer-title">{{ title }}</h3>
          <button class="drawer-close" @click="close">
            <Icon icon="carbon:close" width="20" height="20" />
          </button>
        </div>
        <div class="drawer-body">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: boolean
  title?: string
  position?: 'right' | 'bottom'
  width?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  position: 'right',
  width: '360px',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 900;
}

.drawer {
  position: fixed;
  background: $bg-surface;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: $shadow-xl;
  z-index: 901;
  display: flex;
  flex-direction: column;

  &.right {
    top: 0;
    right: 0;
    bottom: 0;
  }

  &.bottom {
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 80vh;
    border-radius: $radius-xl $radius-xl 0 0;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
}

.drawer-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  @include flex-center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $text-primary;
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}
</style>
