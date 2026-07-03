<template>
  <div class="progress-bar" ref="barRef" @mousedown="startDrag">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }" />
      <div
        class="progress-thumb"
        :style="{ left: percent + '%' }"
        @mousedown.stop="startDrag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ percent: number }>()
const emit = defineEmits<{ seek: [value: number] }>()

const barRef = ref<HTMLElement>()
const isDragging = ref(false)

function getPercent(e: MouseEvent): number {
  if (!barRef.value) return 0
  const rect = barRef.value.getBoundingClientRect()
  return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
}

function startDrag(e: MouseEvent) {
  isDragging.value = true
  emit('seek', getPercent(e) / 100)

  const onMove = (ev: MouseEvent) => {
    emit('seek', getPercent(ev) / 100)
  }

  const onUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped lang="scss">
.progress-bar {
  height: 20px;
  @include flex-center;
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  transition: height 0.1s ease;

  &:hover {
    height: 6px;

    .progress-thumb {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.progress-fill {
  height: 100%;
  background: $gradient-primary;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.15s ease;
}
</style>
