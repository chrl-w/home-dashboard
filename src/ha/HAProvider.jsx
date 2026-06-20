import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { connectWithOAuth, getSavedUrl, saveUrl, clearAuth, subscribeEntities } from './client.js'

const HAContext = createContext(null)

export function useHA() {
  return useContext(HAContext)
}

export function HAProvider({ children }) {
  const [status, setStatus] = useState('idle')
  const [entities, setEntities] = useState({})
  const connRef = useRef(null)
  const unsubRef = useRef(null)

  const savedUrl = getSavedUrl()
  const hasOAuthCallback = window.location.search.includes('code=')

  // Show URL input if no saved URL and this isn't an OAuth callback
  const [showUrlInput, setShowUrlInput] = useState(!savedUrl && !hasOAuthCallback)
  const [inputUrl, setInputUrl] = useState(savedUrl)
  const [error, setError] = useState(null)

  async function doConnect(url) {
    setStatus('connecting')
    setError(null)
    try {
      saveUrl(url)
      // getAuth() will redirect to HA if no tokens exist — page navigation,
      // so code after this only runs on successful auth (stored or post-redirect)
      const conn = await connectWithOAuth(url)
      connRef.current = conn
      unsubRef.current = subscribeEntities(conn, es => setEntities({ ...es }))
      setStatus('connected')
      setShowUrlInput(false)
    } catch (e) {
      setStatus('error')
      // ERR_INVALID_AUTH means tokens expired/revoked — clear and re-prompt
      const msg = e?.message || String(e)
      if (msg.includes('ERR_INVALID_AUTH') || msg.includes('invalid_grant')) {
        clearAuth()
        setError('Session expired — please sign in again.')
      } else {
        setError('Could not connect. Check the URL and try again.')
      }
      setShowUrlInput(true)
    }
  }

  useEffect(() => {
    const url = getSavedUrl()
    if (url || hasOAuthCallback) {
      doConnect(url || inputUrl)
    }
    return () => {
      unsubRef.current?.()
      connRef.current?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function callService(domain, service, data) {
    if (!connRef.current) return Promise.resolve()
    return connRef.current.sendMessagePromise({
      type: 'call_service',
      domain,
      service,
      service_data: data,
    }).catch(() => {})
  }

  function signOut() {
    unsubRef.current?.()
    connRef.current?.close()
    connRef.current = null
    clearAuth()
    setStatus('idle')
    setEntities({})
    setInputUrl('')
    setShowUrlInput(true)
  }

  const value = { status, entities, callService, signOut }

  if (showUrlInput) {
    return (
      <HAContext.Provider value={value}>
        <UrlInputScreen
          url={inputUrl}
          setUrl={setInputUrl}
          onSubmit={() => doConnect(inputUrl)}
          status={status}
          error={error}
        />
      </HAContext.Provider>
    )
  }

  if (status === 'connecting') {
    return (
      <HAContext.Provider value={value}>
        <div style={{
          minHeight: '100dvh',
          background: 'var(--background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}>
          Connecting…
        </div>
      </HAContext.Provider>
    )
  }

  return <HAContext.Provider value={value}>{children}</HAContext.Provider>
}

function UrlInputScreen({ url, setUrl, onSubmit, status, error }) {
  const connecting = status === 'connecting'
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <p style={eyebrowStyle}>Home Dashboard</p>
        <h1 style={headingStyle}>Sign in with Home Assistant</h1>
        <p style={bodyStyle}>
          Enter your Home Assistant URL. You'll be taken to your HA login page to sign in.
        </p>

        <label style={labelStyle}>HA URL</label>
        <input
          style={inputStyle}
          type="url"
          placeholder="https://your.ha.instance"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={connecting}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          autoFocus
        />

        {error && (
          <p style={{ fontSize: 12, color: 'var(--pos-danger)', marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}

        <button
          style={{
            ...btnStyle,
            marginTop: 24,
            opacity: connecting || !url ? 0.5 : 1,
            cursor: connecting || !url ? 'not-allowed' : 'pointer',
          }}
          onClick={onSubmit}
          disabled={connecting || !url}
        >
          {connecting ? 'Connecting…' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}

const eyebrowStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
  marginBottom: 12,
  marginTop: 0,
}

const headingStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 28,
  fontWeight: 600,
  color: 'var(--text-body)',
  marginBottom: 8,
  marginTop: 0,
  lineHeight: 1.2,
}

const bodyStyle = {
  fontSize: 13,
  color: 'var(--text-muted)',
  marginBottom: 32,
  marginTop: 0,
  lineHeight: 1.6,
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: 6,
  fontFamily: 'var(--font-mono)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  background: 'var(--surface-secondary)',
  color: 'var(--text-body)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle = {
  display: 'block',
  width: '100%',
  padding: '12px 0',
  borderRadius: 'var(--radius-full)',
  border: 'none',
  background: 'var(--primary)',
  color: '#fff',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 600,
  boxShadow: '0 0 20px color-mix(in srgb, var(--primary) 38%, transparent)',
}
