import { watch, ref, onUnmounted } from 'vue'
import { Howl } from 'howler'
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import { createTestTone } from '@/utils/audio'

let currentHowl: Howl | null = null
let testToneUrl: string | null = null
let rafId: number | null = null

function cleanup() {
  if (currentHowl) {
    currentHowl.unload()
    currentHowl = null
  }
  if (testToneUrl) {
    URL.revokeObjectURL(testToneUrl)
    testToneUrl = null
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function startTimeUpdates(store: ReturnType<typeof usePlayerStore>) {
  const update = () => {
    if (currentHowl && currentHowl.playing()) {
      store.currentTime = currentHowl.seek() as number
    }
    rafId = requestAnimationFrame(update)
  }
  rafId = requestAnimationFrame(update)
}

export function useAudioEngine() {
  const playerStore = usePlayerStore()
  const { currentSong, isPlaying, volume, playbackRate, currentTime, duration, isMuted } = storeToRefs(playerStore)
  const ready = ref(false)

  // Load and play song when currentSong changes
  watch(
    () => currentSong.value?.id,
    async (newId) => {
      if (!newId) {
        cleanup()
        return
      }

      cleanup()
      ready.value = false

      const song = currentSong.value
      if (!song) return

      // Try to load real audio, fallback to test tone
      try {
        currentHowl = new Howl({
          src: [song.url],
          html5: true,
          volume: isMuted.value ? 0 : volume.value,
          rate: playbackRate.value,
          onload: () => {
            ready.value = true
            duration.value = currentHowl?.duration() || song.duration
            if (isPlaying.value) {
              currentHowl?.play()
              startTimeUpdates(playerStore)
            }
          },
          onplay: () => {
            startTimeUpdates(playerStore)
          },
          onend: () => {
            autoNext(playerStore)
          },
          onloaderror: async () => {
            // Fallback to test tone
            const toneUrl = await createTestTone(song.duration)
            if (toneUrl) {
              testToneUrl = toneUrl
              currentHowl = new Howl({
                src: [toneUrl],
                html5: true,
                volume: isMuted.value ? 0 : volume.value,
                rate: playbackRate.value,
                onload: () => {
                  ready.value = true
                  duration.value = currentHowl?.duration() || song.duration
                  if (isPlaying.value) {
                    currentHowl?.play()
                    startTimeUpdates(playerStore)
                  }
                },
                onplay: () => {
                  startTimeUpdates(playerStore)
                },
                onend: () => {
                  autoNext(playerStore)
                },
              })
            }
          },
        })
      } catch {
        // Silent fail
      }
    }
  )

  // Watch play state
  watch(isPlaying, (playing) => {
    if (!currentHowl) return
    if (playing && ready.value) {
      currentHowl.play()
      startTimeUpdates(playerStore)
    } else {
      currentHowl.pause()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  })

  // Watch volume
  watch(volume, (v) => {
    if (currentHowl) {
      currentHowl.volume(isMuted.value ? 0 : v)
    }
  })

  watch(isMuted, (muted) => {
    if (currentHowl) {
      currentHowl.volume(muted ? 0 : volume.value)
    }
  })

  // Watch playback rate
  watch(playbackRate, (rate) => {
    if (currentHowl) {
      currentHowl.rate(rate)
    }
  })

  // Seek handler
  watch(currentTime, (newTime) => {
    if (currentHowl && ready.value && Math.abs(newTime - (currentHowl.seek() as number)) > 0.5) {
      currentHowl.seek(newTime)
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return { ready }
}

function autoNext(store: ReturnType<typeof usePlayerStore>) {
  const mode = store.playMode
  if (mode === 'repeat-one') {
    store.currentTime = 0
    if (currentHowl) {
      currentHowl.seek(0)
      currentHowl.play()
    }
    return
  }

  if (mode === 'random') {
    const idx = Math.floor(Math.random() * store.playlist.length)
    store.currentIndex = idx
    store.currentSong = store.playlist[idx]
    store.currentTime = 0
    store.duration = store.playlist[idx].duration
    return
  }

  // Sequential
  const nextIdx = store.currentIndex + 1
  if (nextIdx < store.playlist.length) {
    store.currentIndex = nextIdx
    store.currentSong = store.playlist[nextIdx]
    store.currentTime = 0
    store.duration = store.playlist[nextIdx].duration
  } else {
    // End of playlist
    store.isPlaying = false
  }
}
