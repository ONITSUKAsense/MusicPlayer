import { ref, onMounted, onUnmounted } from 'vue'

const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
}

export function useResponsive() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

  const isMobile = computed(() => width.value < breakpoints.mobile)
  const isTablet = computed(() => width.value >= breakpoints.mobile && width.value < breakpoints.tablet)
  const isDesktop = computed(() => width.value >= breakpoints.desktop)

  function onResize() {
    width.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { width, isMobile, isTablet, isDesktop }
}
