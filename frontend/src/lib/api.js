/**
 * SatyaLens API Client
 */

export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '')
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return origin // Route via proxy for mobile/LAN access
    }
  }
  return 'http://localhost:8000'
}

/**
 * Check if the backend forensic engine is online and responding
 */
export const checkHealth = async () => {
  const apiUrl = getApiUrl()

  // 1. Try configured API URL
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)
    const res = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'ok' }))
      return { ok: true, data }
    }
  } catch {
    // Fall through to proxy check
  }

  // 2. Try relative /health via Vite proxy if apiUrl is different from origin
  if (typeof window !== 'undefined' && apiUrl !== window.location.origin) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      const res = await fetch(`/health`, {
        method: 'GET',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json().catch(() => ({ status: 'ok' }))
        return { ok: true, data }
      }
    } catch {
      // Both attempts failed
    }
  }

  return { ok: false, error: 'Connection refused' }
}

/**
 * Execute multimodal forensic analysis (Text, URL, Image, Audio)
 */
export const analyzePayload = async (formData, signal = null) => {
  const apiUrl = getApiUrl()
  let response

  // 1. Try direct API URL
  try {
    response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal,
    })
  } catch (directErr) {
    if (directErr.name === 'AbortError') {
      const abortErr = new Error('Verification cancelled by user.')
      abortErr.name = 'AbortError'
      throw abortErr
    }
    // 2. Fallback to relative /api/analyze if direct call failed (e.g. proxy)
    if (typeof window !== 'undefined' && apiUrl !== window.location.origin) {
      try {
        response = await fetch(`/api/analyze`, {
          method: 'POST',
          body: formData,
          signal,
        })
      } catch (proxyErr) {
        if (proxyErr.name === 'AbortError') {
          const abortErr = new Error('Verification cancelled by user.')
          abortErr.name = 'AbortError'
          throw abortErr
        }
        throw new Error(
          `Unable to connect to the SatyaLens forensic engine at ${apiUrl}. Please verify the FastAPI backend server is running on http://localhost:8000.`
        )
      }
    } else {
      throw new Error(
        `Unable to reach ${apiUrl}/api/analyze. Please verify that your backend server is running.`
      )
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const message =
      errData.detail ||
      `Server returned status ${response.status} (${response.statusText})`
    throw new Error(message)
  }

  return await response.json()
}
