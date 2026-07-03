export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function parseLyric(lyric: string): Array<{ time: number; text: string }> {
  if (!lyric) return []
  const lines = lyric.split('\n')
  const result: Array<{ time: number; text: string }> = []
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/

  for (const line of lines) {
    for (const match of line.matchAll(regex)) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const milliseconds = parseInt(match[3].padEnd(3, '0'))
      const time = minutes * 60 + seconds + milliseconds / 1000
      const text = match[4].trim()
      if (text) result.push({ time, text })
    }
  }

  return result.sort((a, b) => a.time - b.time)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
