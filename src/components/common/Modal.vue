<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <Transition name="scale-in">
          <div v-if="modelValue" class="modal-content" :style="{ maxWidth: width }">
            <div class="modal-header">
              <h3 class="modal-title">{{ title }}</h3>
              <button class="modal-close" @click="close">
                <Icon icon="carbon:close" width="20" height="20" />
              </button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  width: '480px',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  background: $bg-surface;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius-xl;
  box-shadow: $shadow-xl;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
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

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  padding: 0 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
