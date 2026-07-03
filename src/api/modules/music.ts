import request from '../index'
import type { Song, Playlist, Artist, Album, Comment, SearchResult } from '@/types/music'
import type { PaginatedData } from '@/types/api'

// Simulated delay for mock
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Inline mock data
import { mockSongs, mockPlaylists, mockArtists, mockAlbums, mockComments } from '@/mock/songs'

export const musicApi = {
  // Get banners / homepage data
  async getHomeData() {
    await delay()
    return {
      banners: [
        { id: 1, image: 'https://picsum.photos/seed/banner1/1200/400', title: '热门推荐', link: '' },
        { id: 2, image: 'https://picsum.photos/seed/banner2/1200/400', title: '新歌首发', link: '' },
      ],
      dailyRecommend: mockSongs.slice(0, 6),
      hotPlaylists: mockPlaylists,
      hotArtists: mockArtists.slice(0, 6),
    }
  },

  // Songs
  async getSongs(params?: { page?: number; pageSize?: number }) {
    await delay()
    return {
      list: mockSongs,
      total: mockSongs.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
    } as PaginatedData<Song>
  },

  async getSongById(id: number): Promise<Song | null> {
    await delay()
    return mockSongs.find((s) => s.id === id) || null
  },

  // Playlists
  async getPlaylists() {
    await delay()
    return mockPlaylists
  },

  async getPlaylistById(id: number): Promise<Playlist | null> {
    await delay()
    return mockPlaylists.find((p) => p.id === id) || null
  },

  // Artists
  async getArtists() {
    await delay()
    return mockArtists
  },

  async getArtistById(id: number): Promise<Artist | null> {
    await delay()
    return mockArtists.find((a) => a.id === id) || null
  },

  // Albums
  async getAlbumById(id: number): Promise<Album | null> {
    await delay()
    return mockAlbums.find((a) => a.id === id) || null
  },

  // Search
  async search(keyword: string): Promise<SearchResult> {
    await delay(500)
    const lower = keyword.toLowerCase()
    const songs = mockSongs.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.artist.toLowerCase().includes(lower)
    )
    const artists = mockArtists.filter((a) => a.name.toLowerCase().includes(lower))
    return { songs, artists, albums: [], playlists: [] }
  },

  // Comments
  async getComments(songId: number) {
    await delay()
    return mockComments
  },

  // Charts
  async getCharts() {
    await delay()
    return [
      { id: 1, name: '热歌榜', cover: 'https://picsum.photos/seed/chart1/300/300', updateDate: '2024-01-01', songs: mockSongs.slice(0, 5) },
      { id: 2, name: '新歌榜', cover: 'https://picsum.photos/seed/chart2/300/300', updateDate: '2024-01-01', songs: mockSongs.slice(5, 10) },
      { id: 3, name: '飙升榜', cover: 'https://picsum.photos/seed/chart3/300/300', updateDate: '2024-01-01', songs: mockSongs.slice(3, 8) },
    ]
  },
}
