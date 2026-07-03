import { get, set, del, keys } from 'idb-keyval'
import type { UseStore } from 'idb-keyval'
import type { LocalSong } from '@/types/music'

const DB_NAME = 'music-player-db'
const STORE_NAME = 'songs'
const DB_VERSION = 2

// Custom store factory that ensures object stores exist by requesting
// a versioned upgrade. Creates both stores so songs.ts and background.ts coexist.
function createStore(dbName: string, storeName: string) {
  let dbp: Promise<IDBDatabase> | null = null

  async function connect(): Promise<IDBDatabase> {
    if (dbp) return dbp
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, DB_VERSION)
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains('songs')) {
          req.result.createObjectStore('songs')
        }
        if (!req.result.objectStoreNames.contains('settings')) {
          req.result.createObjectStore('settings')
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => { dbp = null; reject(req.error) }
    })
    return dbp
  }

  const storeFn: UseStore = async (txMode, callback) => {
    const db = await connect()
    return callback(db.transaction(storeName, txMode).objectStore(storeName))
  }
  return storeFn
}

const songStore = createStore(DB_NAME, STORE_NAME)

function ensureCoverUrl(song: LocalSong): LocalSong {
  if (song.coverBlob && !song.coverUrl) {
    song.coverUrl = URL.createObjectURL(song.coverBlob)
  }
  return song
}

export async function saveSong(song: LocalSong): Promise<void> {
  const existing = await get<LocalSong>(song.id, songStore)
  if (existing) {
    song.playCount = existing.playCount
  }
  // Don't store ephemeral blob URLs in IndexedDB
  const toStore = { ...song, coverUrl: null }
  await set(song.id, toStore, songStore)
}

export async function getSong(id: string): Promise<LocalSong | undefined> {
  const song = await get<LocalSong>(id, songStore)
  return song ? ensureCoverUrl(song) : undefined
}

export async function getSongList(): Promise<LocalSong[]> {
  const allKeys = await keys(songStore)
  const songs: LocalSong[] = []
  for (const key of allKeys) {
    const song = await get<LocalSong>(key, songStore)
    if (song) {
      ensureCoverUrl(song)
      songs.push(song)
    }
  }
  return songs.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteSong(id: string): Promise<void> {
  const song = await get<LocalSong>(id, songStore)
  if (song?.coverUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(song.coverUrl)
  }
  await del(id, songStore)
}

export async function getTotalSize(): Promise<number> {
  const allKeys = await keys(songStore)
  let total = 0
  for (const key of allKeys) {
    const song = await get<LocalSong>(key, songStore)
    if (song) total += song.fileSize
  }
  return total
}

export async function getSongCount(): Promise<number> {
  const allKeys = await keys(songStore)
  return allKeys.length
}

export async function clearAllSongs(): Promise<void> {
  const allKeys = await keys(songStore)
  for (const key of allKeys) {
    const song = await get<LocalSong>(key, songStore)
    if (song?.coverUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(song.coverUrl)
    }
  }
  for (const key of allKeys) {
    await del(key, songStore)
  }
}
