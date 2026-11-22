/**
 * Live Sample Payloads for 1-Click Verification
 */

export const SAMPLE_VIRAL_TEXT =
  '🚨 URGENT FORWARD: UNESCO has officially declared the Indian National Anthem as the best in the world! NASA satellite has also confirmed cosmic energy alignment. Forward to 10 groups immediately or bad luck will follow!'

export const SAMPLE_FACT_URL = 'https://en.wikipedia.org/wiki/Jana_Gana_Mana'

export const SAMPLE_IMAGE_QUERY =
  'Breaking: Leaked photo claiming new government ₹5000 rupee note issued. Is this currency note genuine?'

export const SAMPLE_AUDIO_QUERY =
  'Urgent voice note circulating on WhatsApp: Immediate emergency lockdown declared starting midnight.'

/**
 * Creates a deterministic mock currency note for ELA tampering analysis
 */
export const createSampleImageFile = async () => {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 640, 320)
  gradient.addColorStop(0, '#134e4a')
  gradient.addColorStop(0.5, '#065f46')
  gradient.addColorStop(1, '#042f2e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 640, 320)

  // Border & Guilloche
  ctx.strokeStyle = '#34d399'
  ctx.lineWidth = 4
  ctx.strokeRect(15, 15, 610, 290)

  // Watermark emblem
  ctx.beginPath()
  ctx.arc(100, 160, 60, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fill()

  // High-contrast spliced text for ELA detection
  ctx.fillStyle = '#FBBF24'
  ctx.font = 'bold 24px monospace'
  ctx.fillText('RESERVE BANK OF INDIA', 150, 70)
  ctx.fillStyle = '#10B981'
  ctx.font = 'bold 36px monospace'
  ctx.fillText('₹ 5000 NEW SPECIMEN', 120, 140)
  ctx.fillStyle = '#EF4444'
  ctx.font = '16px monospace'
  ctx.fillText('LEAKED VIRAL MOCKUP - NOT FOR CIRCULATION', 90, 210)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], 'viral_5000_note_claim.jpg', { type: 'image/jpeg' })
        resolve(file)
      },
      'image/jpeg',
      0.95
    )
  })
}

/**
 * Creates an in-memory sample WAV audio file for voice note testing
 */
export const createSampleAudioFile = () => {
  const sampleRate = 8000
  const durationSec = 2.0
  const numSamples = Math.floor(sampleRate * durationSec)
  const headerSize = 44
  const totalSize = headerSize + numSamples * 2
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, totalSize - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const sample = Math.sin(2 * Math.PI * 440 * t) * 0.4
    const clamped = Math.max(-1, Math.min(1, sample))
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true)
  }

  const blob = new Blob([buffer], { type: 'audio/wav' })
  return new File([blob], 'whatsapp_urgent_lockdown_audio.wav', { type: 'audio/wav' })
}
