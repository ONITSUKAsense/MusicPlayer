import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Song, PlayMode } from '@/types/music'

export const usePlayerStore = defineStore('player', () => {
  // State
  const currentSong = ref<Song | null>(null)
  const playlist = ref<Song[]>([])
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const playMode = ref<PlayMode>('sequential')
  const volume = ref(0.8)
  const currentTime = ref(0)
  const duration = ref(0)
  const isMuted = ref(false)
  const playbackRate = ref(1)

  // Getters
  const hasNext = computed(() => {
    if (playlist.value.length === 0) return false
    if (playMode.value === 'random') return true
    return currentIndex.value < playlist.value.length - 1
  })

  const hasPrev = computed(() => {
    if (playlist.value.length === 0) return false
    if (playMode.value === 'random') return true
    return currentIndex.value > 0
  })

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Actions
  function playSong(song: Song) {
    const index = playlist.value.findIndex((s) => s.id === song.id)
    if (index !== -1) {
      currentIndex.value = index
    } else {
      playlist.value.push(song)
      currentIndex.value = playlist.value.length - 1
    }
    currentSong.value = song
    isPlaying.value = true
    currentTime.value = 0
    duration.value = song.duration
  }

  function playPlaylist(songs: Song[], index = 0) {
    playlist.value = songs
    currentIndex.value = index
    currentSong.value = songs[index]
    isPlaying.value = true
    currentTime.value = 0
    duration.value = songs[index].duration
  }

  function togglePlay() {
    if (!currentSong.value) return
    isPlaying.value = !isPlaying.value
  }

  function pause() {
    isPlaying.value = false
  }

  function resume() {
    if (!currentSong.value) return
    isPlaying.value = true
  }

  function next() {
    if (playlist.value.length === 0) return

    let nextIndex: number
    switch (playMode.value) {
      case 'random':
        nextIndex = Math.floor(Math.random() * playlist.value.length)
        break
      case 'repeat-one':
        nextIndex = currentIndex.value
        break
      default:
        nextIndex = (currentIndex.value + 1) % playlist.value.length
    }

    currentIndex.value = nextIndex
    currentSong.value = playlist.value[nextIndex]
    isPlaying.value = true
    currentTime.value = 0
    duration.value = currentSong.value.duration
  }

  function prev() {
    if (playlist.value.length === 0) return

    let prevIndex: number
    switch (playMode.value) {
      case 'random':
        prevIndex = Math.floor(Math.random() * playlist.value.length)
        break
      case 'repeat-one':
        prevIndex = currentIndex.value
        break
      default:
        prevIndex = currentIndex.value - 1
        if (prevIndex < 0) prevIndex = playlist.value.length - 1
    }

    currentIndex.value = prevIndex
    currentSong.value = playlist.value[prevIndex]
    isPlaying.value = true
    currentTime.value = 0
    duration.value = currentSong.value.duration
  }

  function seek(time: number) {
    currentTime.value = time
  }

  function setVolume(v: number) {
    volume.value = v
    if (v > 0) isMuted.value = false
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function togglePlayMode() {
    const modes: PlayMode[] = ['sequential', 'random', 'repeat-one']
    const currentModeIndex = modes.indexOf(playMode.value)
    playMode.value = modes[(currentModeIndex + 1) % modes.length]
  }

  function setPlaybackRate(rate: number) {
    playbackRate.value = rate
  }

  function addToPlaylist(song: Song) {
    const exists = playlist.value.some((s) => s.id === song.id)
    if (!exists) {
      playlist.value.push(song)
    }
  }

  function removeFromPlaylist(songId: number) {
    const index = playlist.value.findIndex((s) => s.id === songId)
    if (index !== -1) {
      playlist.value.splice(index, 1)
      if (currentIndex.value === index) {
        if (playlist.value.length > 0) {
          next()
        } else {
          currentSong.value = null
          currentIndex.value = -1
          isPlaying.value = false
        }
      } else if (currentIndex.value > index) {
        currentIndex.value--
      }
    }
  }

  function clearPlaylist() {
    playlist.value = []
    currentSong.value = null
    currentIndex.value = -1
    isPlaying.value = false
    currentTime.value = 0
  }

  return {
    currentSong,
    playlist,
    currentIndex,
    isPlaying,
    playMode,
    volume,
    currentTime,
    duration,
    isMuted,
    playbackRate,
    hasNext,
    hasPrev,
    progress,
    playSong,
    playPlaylist,
    togglePlay,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    togglePlayMode,
    setPlaybackRate,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
  }
})
