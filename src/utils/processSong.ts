import { parseBlob } from 'music-metadata'
import { generateId } from '@/utils/format'
import type { LocalSong } from '@/types/music'

export interface ProcessResult {
  song: LocalSong
  lrcText: string | null
}

/**
 * Process an uploaded audio file — extract metadata, cover art, and create a LocalSong.
 * If metadata parsing fails, falls back to using the filename as the title.
 */
export async function processMp3File(
  file: File,
  lrcText?: string | null,
): Promise<ProcessResult> {
  const id = generateId()
  const fileName = file.name.replace(/\.[^.]+$/, '')

  let title = fileName
  let artist = ''
  let album = ''
  let duration = 0
  let coverBlob: Blob | null = null

  // Read file contents first — ensures data is captured before any potential
  // File object invalidation (important for browser/electron compatibility)
  const fileData = await file.arrayBuffer()
  const audioBlob = new Blob([fileData], { type: file.type || 'audio/mpeg' })

  // Parse metadata from the original file (music-metadata reads the blob internally)
  try {
    const metadata = await parseBlob(file, { duration: true })

    if (metadata.common.title) title = metadata.common.title
    if (metadata.common.artist) artist = metadata.common.artist
    if (metadata.common.album) album = metadata.common.album
    if (metadata.format.duration) duration = Math.round(metadata.format.duration)

    // Extract embedded cover art
    const pic = metadata.common.picture?.[0]
    if (pic) {
      coverBlob = new Blob([pic.data.slice(0)], { type: pic.format })
    }
  } catch (err) {
    console.warn('Metadata parsing failed, using filename fallback:', err)
    // Fallback: song will use filename as title, duration from audio element later
  }

  const song: LocalSong = {
    id,
    fileName: file.name,
    title,
    artist,
    album,
    duration,
    fileType: file.type || 'audio/mpeg',
    fileSize: file.size,
    coverUrl: coverBlob ? URL.createObjectURL(coverBlob) : null,
    coverBlob,
    audioBlob,
    lyrics: lrcText || null,
    createdAt: Date.now(),
    playCount: 0,
  }

  return { song, lrcText: lrcText || null }
}
