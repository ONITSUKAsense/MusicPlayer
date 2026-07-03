<template>
  <Transition name="fade">
    <button
      v-if="visible"
      class="scroll-to-top"
      @click="scrollToTop"
    >
      <Icon icon="carbon:chevron-up" width="20" height="20" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const visible = ref(false)
let scrollContainer: HTMLElement | null = null

function onScroll() {
  if (!scrollContainer) return
  visible.value = scrollContainer.scrollTop > 300
}

function scrollToTop() {
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  scrollContainer = document.querySelector('.layout-content')
  scrollContainer?.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  scrollContainer?.removeEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">
.scroll-to-top {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: $primary;
  color: white;
  border: none;
  cursor: pointer;
  @include flex-center;
  box-shadow: $shadow-glow;
  transition: all $transition-fast;
  z-index: 50;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
  }
}
</style>
