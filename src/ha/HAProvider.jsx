import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { connect, getSavedCredentials, saveCredentials, clearCredentials, subscribeEntities } from './client.js'

const HAContext = createContext(null)

export function useHA() {
  return useContext(HAContext)
}

export function HAProvider({ children }) {
  const [status, setStatus] = useState('idle') // idle | connecting | connected | error
  const [entities, setEntities] = useState({})
  const [error, setError] = useState(null)
  const connRef = useRef(null)
  const unsubRef = useRef(null)

  const { url: savedUrl, token: savedToken } = getSavedCredentials()
  const [url, setUrl] = useState(savedUrl)
  const [token, setToken] = useState(savedToken)
  const [showSetup, setShowSetup] = useState(!savedUrl || !savedToken)

  async function doConnect(haUrl, haToken) {
    setStatus('connecting')
    setError(null)
    try {
      saveCredentials(haUrl, haToken)
      const conn = await connect(haUrl, haToken)
      connRef.current = conn
      unsubRef.current = subscribeEntities(conn, es => setEntities({ ...es }))
      setStatus('connected')
      setShowSetup(false)
    } catch (e) {
      setStatus('error')
      setError(e?.message || 'Connection failed')
    }
  }

  useEffect(() => {
    if (savedUrl && savedToken) {
      doConnect(savedUrl, savedToken)
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

  function disconnect() {
    unsubRef.current?.()
    connRef.current?.close()
    connRef.current = null
    clearCredentials()
    setStatus('idle')
    setEntities({})
    setShowSetup(true)
    setUrl('')
    setToken('')
  }

  const value = { status, entities, callService, disconnect }

  return (
    <HAContext.Provider value={value}>
      {showSetup ? (
        <SetupScreen
          url={url} token={token}
          setUrl={setUrl} setToken={setToken}
          onConnect={() => doConnect(url, token)}
          status={status} error={error}
        />
      ) : children}
    </HAContext.Provider>
  )
}

function SetupScreen({ url, token, setUrl, setToken, onConnect, status, error }) {
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
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 12 }}>
          Home Dashboard
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--text-body)', marginBottom: 8, lineHeight: 1.2 }}>
          Connect to Home Assistant
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          Enter your Home Assistant URL and a long-lived access token to get started.
        </p>

        <label style={labelStyle}>HA URL</label>
        <input
          style={inputStyle}
          type="url"
          placeholder="http://homeassistant.local:8123"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={connecting}
        />

        <label style={{ ...labelStyle, marginTop: 16 }}>Access token</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="Long-lived access token"
          value={token}
          onChange={e => setToken(e.target.value)}
          disabled={connecting}
          onKeyDown={e => e.key === 'Enter' && onConnect()}
        />

        {error && (
          <p style={{ fontSize: 12, color: 'var(--pos-danger)', marginTop: 12 }}>{error}</p>
        )}

        <button
          style={{
            ...btnStyle,
            marginTop: 24,
            opacity: connecting || !url || !token ? 0.5 : 1,
            cursor: connecting || !url || !token ? 'not-allowed' : 'pointer',
          }}
          onClick={onConnect}
          disabled={connecting || !url || !token}
        >
          {connecting ? 'Connecting…' : 'Connect'}
        </button>
      </div>
    </div>
  )
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
