export interface LocalSong {
  id: string
  fileName: string
  title: string
  artist: string
  album: string
  duration: number
  fileType: string
  fileSize: number
  coverUrl: string | null
  coverBlob: Blob | null
  audioBlob: Blob | null
  lyrics: string | null
  createdAt: number
  playCount: number
}

export interface LyricLine {
  time: number
  text: string
}

export type PlayMode = 'sequential' | 'random' | 'repeat-one'
export type ThemeMode = 'dark' | 'light'
