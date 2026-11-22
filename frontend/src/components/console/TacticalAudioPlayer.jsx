import React, { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  RotateCcw,
  Activity,
  Sliders,
} from 'lucide-react'

// Generate 44 deterministic baseline heights for tactical waveform bars
const BAR_COUNT = 44
const DEFAULT_WAVE_HEIGHTS = [
  35, 55, 75, 45, 90, 60, 40, 85, 95, 70, 50, 65, 80, 100, 85, 60,
  45, 70, 90, 80, 65, 95, 75, 55, 40, 65, 85, 100, 90, 70, 50, 40,
  60, 80, 95, 85, 70, 55, 45, 65, 80, 70, 50, 30
]

export default function TacticalAudioPlayer({
  src,
  duration = null,
  title = 'Acoustic Payload Stream',
  syntheticLikelihood = 'None',
}) {
  const audioRef = useRef(null)
  const animFrameRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration || 0)
  const [volume, setVolume] = useState(0.85)
  const [prevVolume, setPrevVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [activeFrequencies, setActiveFrequencies] = useState(DEFAULT_WAVE_HEIGHTS)
  const [hoverSeekPercent, setHoverSeekPercent] = useState(null)

  // Sync duration prop if provided
  useEffect(() => {
    if (duration && duration > 0 && !totalDuration) {
      setTotalDuration(duration)
    }
  }, [duration, totalDuration])

  // Sync initial volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [src])

  // 60fps Smooth Playhead Loop using requestAnimationFrame
  useEffect(() => {
    const updateSmoothProgress = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime)
        animFrameRef.current = requestAnimationFrame(updateSmoothProgress)
      }
    }

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(updateSmoothProgress)
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isPlaying])

  // Native HTML5 Audio Event Listeners for Lifecycle Synchronization
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [src])

  // Dynamic FFT Spectrum Bars Animation
  useEffect(() => {
    let animInterval
    if (isPlaying) {
      animInterval = setInterval(() => {
        setActiveFrequencies((prev) =>
          prev.map((val, idx) => {
            const jitter = Math.sin(Date.now() / 150 + idx * 0.4) * 30
            const randomPulse = Math.random() * 20 - 10
            const nextVal = Math.min(100, Math.max(15, DEFAULT_WAVE_HEIGHTS[idx] + jitter + randomPulse))
            return Math.round(nextVal)
          })
        )
      }, 90)
    } else {
      setActiveFrequencies(DEFAULT_WAVE_HEIGHTS)
    }
    return () => clearInterval(animInterval)
  }, [isPlaying])

  // Playback Control Handlers
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => {
        console.warn('Playback interrupted:', err)
      })
    }
  }

  const handleRestart = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    setCurrentTime(0)
    audio.play()
  }

  const handleSeek = (newTime) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(newTime, totalDuration || 1))
    audio.currentTime = clamped
    setCurrentTime(clamped)
  }

  const handleWaveformClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    if (totalDuration > 0) {
      handleSeek(percent * totalDuration)
    }
  }

  const handleMouseMoveWaveform = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    setHoverSeekPercent(percent * 100)
  }

  const handleMouseLeaveWaveform = () => {
    setHoverSeekPercent(null)
  }

  // Volume & Mute Controls
  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted || volume === 0) {
      // Unmute and restore previous volume
      const restored = prevVolume > 0.05 ? prevVolume : 0.85
      audio.muted = false
      audio.volume = restored
      setVolume(restored)
      setIsMuted(false)
    } else {
      // Mute
      setPrevVolume(volume)
      audio.muted = true
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (newVal) => {
    const audio = audioRef.current
    const val = parseFloat(newVal)
    setVolume(val)
    if (audio) {
      audio.volume = val
      if (val === 0) {
        audio.muted = true
        setIsMuted(true)
      } else {
        audio.muted = false
        setIsMuted(false)
        setPrevVolume(val)
      }
    }
  }

  // Speed Control Handler
  const handleSpeedChange = (speed) => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = speed
    setPlaybackSpeed(speed)
  }

  // Format seconds to tactical timecode MM:SS.s
  const formatTimecode = (sec) => {
    if (isNaN(sec) || !isFinite(sec) || sec < 0) sec = 0
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    const tenths = Math.floor((sec % 1) * 10)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${tenths}`
  }

  const progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0
  const activeVolume = isMuted ? 0 : volume

  return (
    <div className="relative rounded-2xl bg-slate-950/95 dark:bg-[#070D18]/95 border border-cyan-500/30 p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)] overflow-hidden font-mono select-none">
      {/* Background HUD Grid Scanlines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
          backgroundSize: '16px 16px, 32px 32px',
        }}
      />

      {/* Hidden Native Audio Element */}
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
        />
      )}

      {/* TOP HUD TELEMETRY HEADER */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-cyan-500/20 text-[10px] text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isPlaying ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            )}
          </span>
          <span className="font-bold tracking-wider uppercase text-cyan-300">
            {isPlaying ? 'REC-CH.01 // SIGNAL STREAMING (60 FPS)' : 'REC-CH.01 // SIGNAL BUFFERED'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            44.1 kHz • 16-BIT PCM
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            FFT SPECTRAL SCAN
          </span>
        </div>
      </div>

      {/* TACTICAL FREQUENCY SPECTRUM WAVEFORM */}
      <div
        onClick={handleWaveformClick}
        onMouseMove={handleMouseMoveWaveform}
        onMouseLeave={handleMouseLeaveWaveform}
        title="Click or drag to seek position"
        className="relative z-10 w-full h-24 bg-slate-900/80 rounded-xl border border-cyan-500/20 p-3 mb-4 cursor-pointer group flex items-end justify-between gap-[3px] overflow-hidden"
      >
        {/* Subtle Decibel / Amplitude Gridlines */}
        <div className="absolute inset-x-0 top-1/4 border-b border-cyan-500/10 pointer-events-none" />
        <div className="absolute inset-x-0 top-2/4 border-b border-cyan-500/10 pointer-events-none" />
        <div className="absolute inset-x-0 top-3/4 border-b border-cyan-500/10 pointer-events-none" />

        {/* Hover Scrub Ghost Guide */}
        {hoverSeekPercent !== null && (
          <div
            style={{ left: `${hoverSeekPercent}%` }}
            className="absolute top-0 bottom-0 w-[1px] bg-cyan-400/40 border-r border-dashed border-cyan-300/40 pointer-events-none z-20"
          />
        )}

        {/* Dynamic Spectrum / Waveform Bars */}
        {activeFrequencies.map((heightPercent, idx) => {
          const barProgress = (idx / BAR_COUNT) * 100
          const isPassed = barProgress <= progressPercent
          const isCurrent = Math.abs(barProgress - progressPercent) < (100 / BAR_COUNT) * 1.5

          let barBg = 'bg-cyan-950/80 border-cyan-500/20'
          if (isPassed) {
            barBg = isPlaying
              ? 'bg-gradient-to-t from-cyan-500 to-blue-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
              : 'bg-cyan-500'
          } else if (isCurrent) {
            barBg = 'bg-white shadow-[0_0_12px_#ffffff]'
          }

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-sm transition-all duration-100 ${barBg}`}
              />
            </div>
          )
        })}

        {/* HUD Needle / Playhead Indicator (Zero Transition for Ultra-Smooth RAF Gliding) */}
        <div
          style={{ left: `${progressPercent}%` }}
          className="absolute top-0 bottom-0 w-[2px] bg-cyan-300 shadow-[0_0_12px_#22d3ee] pointer-events-none z-30 transition-none"
        >
          <div className="w-2.5 h-2.5 -ml-[4px] bg-cyan-300 rounded-full shadow-[0_0_10px_#22d3ee]" />
        </div>

        {/* Tactical Crosshair Watermark */}
        <div className="absolute top-2 right-2 text-[9px] text-cyan-500/40 font-mono pointer-events-none">
          PEAK: -3.2 dBFS
        </div>
      </div>

      {/* SCRUBBER TIMELINE TRACK */}
      <div className="relative z-10 mb-4">
        <div
          onClick={handleWaveformClick}
          className="relative w-full h-2.5 bg-slate-900 rounded-full border border-cyan-500/30 cursor-pointer overflow-hidden group"
        >
          {/* Progress Fill (Transition-none during playback ensures zero-latency 60fps tracking) */}
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-none"
          />
        </div>

        {/* Timecode Readouts */}
        <div className="flex items-center justify-between text-xs mt-1.5 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="text-[10px] text-slate-500">PLAYHEAD:</span>
            <span className="font-bold tracking-wider">{formatTimecode(currentTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] text-slate-500">TOTAL:</span>
            <span className="font-semibold tracking-wider">
              {formatTimecode(totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* TACTICAL HUD CONTROLS BAR */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cyan-500/20">
        {/* Left Section: Play / Pause / Restart + Tactile Volume Slider Deck */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Play / Pause Trigger */}
          <button
            onClick={togglePlay}
            disabled={!src}
            title={isPlaying ? 'Pause Tactical Playback' : 'Initiate Audio Forensics Playback'}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.7)] scale-105'
                : 'bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay Button */}
          <button
            onClick={handleRestart}
            disabled={!src}
            title="Replay from 00:00.0"
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-700 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Integrated Tactical Volume Controller Deck */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-cyan-500/20 shadow-inner group">
            {/* Mute Toggle Button */}
            <button
              onClick={toggleMute}
              disabled={!src}
              title={isMuted || activeVolume === 0 ? 'Unmute Audio' : 'Mute Audio'}
              className="text-slate-400 hover:text-cyan-300 transition-colors focus:outline-none"
            >
              {isMuted || activeVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
              ) : activeVolume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-cyan-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Tactical Linear Volume Range Slider */}
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={activeVolume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                disabled={!src}
                className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                title={`Volume: ${Math.round(activeVolume * 100)}%`}
              />
              <span className="text-[10px] text-cyan-300 font-mono w-7 text-right font-bold">
                {Math.round(activeVolume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Section: Speed Controls & Telemetry */}
        <div className="flex items-center gap-2">
          {/* Speed Controls Selector (Slow-Mo to Rapid) */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-cyan-500/20 text-xs">
            <span className="text-[10px] text-slate-500 px-1 font-semibold hidden sm:inline">
              RATE:
            </span>
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed === 0.75 ? '0.75x' : `${speed}x`}
              </button>
            ))}
          </div>

          {/* Tactical Telemetry Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{isPlaying ? 'SPECTRUM AUDIT' : 'BUFFERED'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
