// Generate a test audio tone when real audio files aren't available
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function createTestTone(duration: number): Promise<string> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext()
      const sampleRate = ctx.sampleRate
      const length = sampleRate * Math.min(duration, 30) // Cap at 30s
      const buffer = ctx.createBuffer(1, length, sampleRate)
      const data = buffer.getChannelData(0)

      // Generate a pleasant-sounding test tone
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        const fadeIn = Math.min(1, t * 0.1)
        const fadeOut = Math.min(1, (Math.min(duration, 30) - t) * 0.1)
        const envelope = fadeIn * fadeOut

        // Soft pad-like tone with harmonics
        data[i] =
          envelope *
          (0.3 * Math.sin(2 * Math.PI * 220 * t) + // A3
            0.15 * Math.sin(2 * Math.PI * 330 * t) + // E4
            0.1 * Math.sin(2 * Math.PI * 440 * t) + // A4
            0.05 * Math.sin(2 * Math.PI * 880 * t)) // A5
      }

      // Convert to WAV blob
      const wavData = encodeWAV(buffer)
      const blob = new Blob([wavData], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      resolve(url)
    } catch {
      resolve('')
    }
  })
}

function encodeWAV(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitsPerSample = 16

  const data = buffer.getChannelData(0)
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
  const blockAlign = (numChannels * bitsPerSample) / 8
  const dataSize = data.length * numChannels * (bitsPerSample / 8)

  const arrayBuffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(arrayBuffer)

  // WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Write samples
  let offset = 44
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
    offset += 2
  }

  return arrayBuffer
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}
