import { watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { getSong } from '@/db/songs'
import type { LocalSong } from '@/types/music'

let audio: HTMLAudioElement | null = null
let currentBlobUrl: string | null = null
let currentSongId: string | null = null
let store: ReturnType<typeof usePlayerStore> | null = null

function revokeBlobUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl)
    currentBlobUrl = null
  }
}

function cleanupAudio() {
  if (!audio) return
  audio.pause()
  audio.src = ''
  revokeBlobUrl()
}

async function loadAndPlay(song: LocalSong) {
  if (!audio) return
  cleanupAudio()

  // Get the song with audio blob from IndexedDB
  let songWithBlob = song
  if (!song.audioBlob) {
    const fromDb = await getSong(song.id)
    if (fromDb?.audioBlob) {
      songWithBlob = fromDb
    }
  }

  if (!songWithBlob.audioBlob) {
    console.error('No audio blob found for song:', song.id)
    return
  }

  currentSongId = song.id
  const blobUrl = URL.createObjectURL(songWithBlob.audioBlob)
  currentBlobUrl = blobUrl

  audio.src = blobUrl
  audio.load()

  try {
    await audio.play()
    if (store) {
      store.isPlaying = true
      store.duration = song.duration || audio.duration
    }
  } catch (err) {
    console.warn('Playback failed:', err)
    if (store) store.isPlaying = false
  }
}

function onTimeUpdate() {
  if (!audio || !store) return
  store.currentTime = audio.currentTime
}

function onEnded() {
  if (!store) return
  if (!audio) return
  audio.currentTime = 0
  store.next()
}

function onError() {
  if (!store || !audio) return
  console.error('Audio error:', audio.error?.message)
  store.isPlaying = false
}

function onLoadedMetadata() {
  if (!audio || !store) return
  if (audio.duration && isFinite(audio.duration) && !store.duration) {
    store.duration = audio.duration
  }
}

export function useAudioEngine() {
  store = usePlayerStore()

  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
  }

  // Watch: song changes → load and play
  watch(
    () => store?.currentSong,
    (newSong, oldSong) => {
      if (newSong && newSong.id !== oldSong?.id) {
        loadAndPlay(newSong)
      }
    }
  )

  // Watch: isPlaying → play/pause
  watch(
    () => store?.isPlaying,
    (playing) => {
      if (!audio || !store?.currentSong) return
      if (playing) {
        audio.play().catch(() => {
          if (store) store.isPlaying = false
        })
      } else {
        audio.pause()
      }
    }
  )

  // Watch: volume changes
  watch(
    () => store?.volume,
    (v) => {
      if (audio && v !== undefined) audio.volume = v
    },
    { immediate: true }
  )

  // Watch: mute changes
  watch(
    () => store?.isMuted,
    (muted) => {
      if (audio) audio.muted = !!muted
    },
    { immediate: true }
  )

  // Watch: seek
  watch(
    () => store?.currentTime,
    (t) => {
      if (!audio || !store || t === undefined) return
      if (Math.abs(audio.currentTime - t) > 0.5) {
        audio.currentTime = t
      }
    }
  )

  // Watch: playback rate
  watch(
    () => store?.playbackRate,
    (rate) => {
      if (audio && rate) audio.playbackRate = rate
    },
    { immediate: true }
  )

  // Cleanup function
  function destroy() {
    cleanupAudio()
    if (audio) {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio = null
    }
    store = null
    currentSongId = null
  }

  return { destroy }
}
