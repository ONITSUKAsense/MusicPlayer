// Song
export interface Song {
  id: number
  title: string
  artist: string
  artistId: number
  album: string
  albumId: number
  cover: string
  duration: number
  url: string
  lyric: string
  mvId?: number
  genre?: string
}

// Playlist
export interface Playlist {
  id: number
  name: string
  cover: string
  description: string
  tags: string[]
  songCount: number
  playCount: number
  favoriteCount: number
  creator: Artist
  songs: Song[]
  createdAt: string
}

// Artist
export interface Artist {
  id: number
  name: string
  avatar: string
  cover: string
  bio: string
  genre: string
  songCount: number
  albumCount: number
  followerCount: number
  isFollowed: boolean
}

// Album
export interface Album {
  id: number
  title: string
  cover: string
  artist: string
  artistId: number
  releaseDate: string
  songCount: number
  songs: Song[]
}

// MV
export interface MV {
  id: number
  title: string
  artist: string
  artistId: number
  cover: string
  url: string
  playCount: number
  duration: number
}

// Lyric line
export interface LyricLine {
  time: number
  text: string
}

// Comment
export interface Comment {
  id: number
  user: User
  content: string
  createdAt: string
  likes: number
  replies: Comment[]
}

// User
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  level: number
  isVip: boolean
  followerCount: number
  followingCount: number
}

// Chart / Ranking
export interface Chart {
  id: number
  name: string
  cover: string
  updateDate: string
  songs: Song[]
}

// Search
export interface SearchResult {
  songs: Song[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
}

export type PlayMode = 'sequential' | 'random' | 'repeat-one'

export type ThemeMode = 'dark' | 'light'

export type Language = 'zh-CN' | 'en-US'
