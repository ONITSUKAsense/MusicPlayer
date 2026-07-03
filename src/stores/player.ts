import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { LocalSong, PlayMode } from '@/types/music'
import { storage } from '@/utils/storage'
import { getSongList } from '@/db/songs'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<LocalSong | null>(null)
  const playlist = ref<LocalSong[]>([])
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const playMode = ref<PlayMode>((storage.get<PlayMode>('playMode')) || 'sequential')
  const volume = ref(storage.get<number>('volume') ?? 0.8)
  const currentTime = ref(0)
  const duration = ref(0)
  const isMuted = ref(storage.get<boolean>('isMuted') ?? false)
  const playbackRate = ref(storage.get<number>('playbackRate') ?? 1)

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

  watch(playMode, (v) => storage.set('playMode', v))
  watch(volume, (v) => storage.set('volume', v))
  watch(isMuted, (v) => storage.set('isMuted', v))
  watch(playbackRate, (v) => storage.set('playbackRate', v))

  function playSong(song: LocalSong) {
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
    savePlaylist()
  }

  function playPlaylist(songs: LocalSong[], index = 0) {
    playlist.value = songs
    currentIndex.value = index
    currentSong.value = songs[index]
    isPlaying.value = true
    currentTime.value = 0
    duration.value = songs[index].duration
    savePlaylist()
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
    const idx = modes.indexOf(playMode.value)
    playMode.value = modes[(idx + 1) % modes.length]
  }

  function setPlaybackRate(rate: number) {
    playbackRate.value = rate
  }

  function addToPlaylist(song: LocalSong) {
    const exists = playlist.value.some((s) => s.id === song.id)
    if (!exists) {
      playlist.value.push(song)
      savePlaylist()
    }
  }

  function removeFromPlaylist(songId: string) {
    const index = playlist.value.findIndex((s) => s.id === songId)
    if (index !== -1) {
      playlist.value.splice(index, 1)
      if (currentIndex.value === index) {
        if (playlist.value.length > 0) {
          currentIndex.value = Math.min(index, playlist.value.length - 1)
          currentSong.value = playlist.value[currentIndex.value]
        } else {
          currentSong.value = null
          currentIndex.value = -1
          isPlaying.value = false
        }
      } else if (currentIndex.value > index) {
        currentIndex.value--
      }
      savePlaylist()
    }
  }

  function clearPlaylist() {
    playlist.value = []
    currentSong.value = null
    currentIndex.value = -1
    isPlaying.value = false
    currentTime.value = 0
    storage.remove('playlist')
  }

  function savePlaylist() {
    storage.set('playlist', playlist.value.map((s) => s.id))
    storage.set('lastPlayed', currentSong.value?.id ?? '')
    storage.set('lastPosition', currentTime.value)
  }

  function loadFromStorage() {
    const saved = storage.get<string[]>('playlist')
    if (saved && saved.length > 0) {
      getSongList().then((songs) => {
        const idSet = new Set(saved)
        playlist.value = songs.filter((s) => idSet.has(s.id))
        const lastId = storage.get<string>('lastPlayed')
        if (lastId) {
          const idx = playlist.value.findIndex((s) => s.id === lastId)
          if (idx !== -1) {
            currentIndex.value = idx
            currentSong.value = playlist.value[idx]
          }
        }
      })
    }
  }

  return {
    currentSong, playlist, currentIndex, isPlaying, playMode,
    volume, currentTime, duration, isMuted, playbackRate,
    hasNext, hasPrev, progress,
    playSong, playPlaylist, togglePlay, pause, resume,
    next, prev, seek, setVolume, toggleMute,
    togglePlayMode, setPlaybackRate, addToPlaylist,
    removeFromPlaylist, clearPlaylist, loadFromStorage,
  }
})
