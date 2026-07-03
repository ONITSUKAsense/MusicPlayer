import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useLazyLoad(
  target: Ref<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string }
) {
  const isVisible = ref(false)
  const { threshold = 0.1, rootMargin = '100px' } = options || {}

  let observer: IntersectionObserver | null = null

  function setupObserver(el: HTMLElement) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
  }

  watch(
    target,
    (el) => {
      if (el) setupObserver(el)
      else isVisible.value = false
    },
    { immediate: true }
  )

  onUnmounted(() => observer?.disconnect())

  return { isVisible }
}
