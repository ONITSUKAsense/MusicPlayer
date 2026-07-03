import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { get, set, del } from 'idb-keyval'
import type { UseStore } from 'idb-keyval'
import { storage } from '@/utils/storage'

const DB_NAME = 'music-player-db'
const STORE_NAME = 'settings'
const DB_VERSION = 2

// Same pattern as songs.ts — ensures the object store exists
function createStore(dbName: string, storeName: string) {
  let dbp: Promise<IDBDatabase> | null = null

  async function connect(): Promise<IDBDatabase> {
    if (dbp) return dbp
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, DB_VERSION)
      req.onupgradeneeded = () => {
        // Create both stores on first open so they coexist
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

const bgStore = createStore(DB_NAME, STORE_NAME)
const BG_KEY = 'custom-bg'

export const useBackgroundStore = defineStore('background', () => {
  const bgImage = ref<string | null>(null)
  const opacity = ref(storage.get<number>('bgOpacity') ?? 0.65)
  const blur = ref(storage.get<number>('bgBlur') ?? 0)
  const hasBackground = ref(false)

  watch(opacity, (v) => storage.set('bgOpacity', v))
  watch(blur, (v) => storage.set('bgBlur', v))

  async function loadBackground() {
    const blob = await get<Blob>(BG_KEY, bgStore)
    if (blob) {
      bgImage.value = URL.createObjectURL(blob)
      hasBackground.value = true
    }
  }

  async function uploadBackground(file: File) {
    if (bgImage.value?.startsWith('blob:')) {
      URL.revokeObjectURL(bgImage.value)
    }
    const blob = new Blob([await file.arrayBuffer()], { type: file.type })
    await set(BG_KEY, blob, bgStore)
    bgImage.value = URL.createObjectURL(blob)
    hasBackground.value = true
  }

  async function clearBackground() {
    if (bgImage.value?.startsWith('blob:')) {
      URL.revokeObjectURL(bgImage.value)
    }
    await del(BG_KEY, bgStore)
    bgImage.value = null
    hasBackground.value = false
  }

  return {
    bgImage, opacity, blur, hasBackground,
    loadBackground, uploadBackground, clearBackground,
  }
})
