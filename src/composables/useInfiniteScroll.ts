import { ref, onMounted, onUnmounted } from 'vue'

interface Options {
  threshold?: number
  distance?: number
  initialLoad?: boolean
}

export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  options: Options = {}
) {
  const { threshold = 200, distance = 100, initialLoad = true } = options

  const isLoading = ref(false)
  const hasMore = ref(true)
  const sentinelRef = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  async function handleIntersect(entries: IntersectionObserverEntry[]) {
    const entry = entries[0]
    if (entry.isIntersecting && hasMore.value && !isLoading.value) {
      isLoading.value = true
      try {
        await loadMore()
      } finally {
        isLoading.value = false
      }
    }
  }

  onMounted(() => {
    if (initialLoad) {
      loadMore().catch(() => {})
    }

    observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${threshold}px`,
    })

    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    isLoading,
    hasMore,
    sentinelRef,
  }
}
