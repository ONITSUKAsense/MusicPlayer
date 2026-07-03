import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import type { LocalSong } from '@/types/music'
import { formatTime } from '@/utils/format'

export function usePlayer() {
  const playerStore = usePlayerStore()
  const {
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
  } = storeToRefs(playerStore)

  const currentTimeFormatted = computed(() => formatTime(currentTime.value))
  const durationFormatted = computed(() => formatTime(duration.value))

  function handlePlaySong(song: LocalSong) {
    playerStore.playSong(song)
  }

  function handlePlayPlaylist(songs: LocalSong[], index = 0) {
    playerStore.playPlaylist(songs, index)
  }

  return {
    currentSong, playlist, currentIndex, isPlaying,
    playMode, volume, currentTime, duration,
    isMuted, playbackRate, hasNext, hasPrev, progress,
    currentTimeFormatted, durationFormatted,
    handlePlaySong, handlePlayPlaylist,
    togglePlay: playerStore.togglePlay,
    pause: playerStore.pause,
    resume: playerStore.resume,
    next: playerStore.next,
    prev: playerStore.prev,
    seek: playerStore.seek,
    setVolume: playerStore.setVolume,
    toggleMute: playerStore.toggleMute,
    togglePlayMode: playerStore.togglePlayMode,
    setPlaybackRate: playerStore.setPlaybackRate,
    addToPlaylist: playerStore.addToPlaylist,
    removeFromPlaylist: playerStore.removeFromPlaylist,
    clearPlaylist: playerStore.clearPlaylist,
  }
}
