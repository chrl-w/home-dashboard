import { useRef, useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Moon, Lightbulb, RotateCcw, Sofa, Bed, UtensilsCrossed, DoorOpen, Bath, ArrowUpNarrowWide, Sparkles, Thermometer, Shield, Music, Zap } from 'lucide-react'
import { ROOMS } from '../data/rooms.js'

const SCENE_META = {
  relax:  { label: 'Relax',  Icon: Moon },
  bright: { label: 'Bright', Icon: Lightbulb },
}

const ROOM_ICONS = { Sofa, Bed, UtensilsCrossed, DoorOpen, Bath, ArrowUpNarrowWide }

const PRESETS = [0, 10, 30, 60, 100]

const COMING_SOON = [
  { name: 'Climate',      Icon: Thermometer },
  { name: 'Security',     Icon: Shield },
  { name: 'Media & audio', Icon: Music },
  { name: 'Energy',       Icon: Zap },
]

export function SettingsModal({ settings, onUpdateLight, onResetRoom, onClose }) {
  const overlayRef = useRef(null)
  const [view, setView] = useState('hub')
  const [activeRoomId, setActiveRoomId] = useState(ROOMS[0].id)
  const [activeScene, setActiveScene] = useState('relax')
  const [saveStatus, setSaveStatus] = useState('saved')
  const saveTimer = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (!document.getElementById('sc-spin')) {
      const s = document.createElement('style')
      s.id = 'sc-spin'
      s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }'
      document.head.appendChild(s)
    }
    return () => { document.body.style.overflow = '' }
  }, [])

  function markSaving() {
    clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(() => setSaveStatus('saved'), 650)
  }

  const activeRoom = ROOMS.find(r => r.id === activeRoomId)
  const scene = activeRoom.scenes.find(s => s.id === activeScene)
  const sceneStates = settings[activeRoomId]?.[activeScene] ?? scene?.states ?? {}

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div style={{
        width: '100%',
        maxHeight: '88%',
        background: '#12111A',
        borderRadius: '28px 28px 0 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -24px 60px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
      }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '11px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 42, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.16)' }} />
        </div>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '12px 22px 16px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 8, right: 18,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: 999,
              color: '#6E6B82', cursor: 'pointer', transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E9E7F2'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6E6B82'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={20} />
          </button>

          {view === 'hub' && (
            <>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', color: '#F4F2FA', lineHeight: 1.1 }}>
                Settings
              </h1>
              <div style={{ marginTop: 7, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: '#6E6B82', textTransform: 'uppercase' }}>
                Living · Home
              </div>
            </>
          )}

          {view === 'scenes' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 40 }}>
                <button
                  onClick={() => setView('hub')}
                  style={{
                    flexShrink: 0, width: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#1A1927', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, color: '#E9E7F2', cursor: 'pointer', transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 600, letterSpacing: '-0.01em', color: '#F4F2FA', lineHeight: 1.1 }}>
                  Scenes
                </h1>
              </div>
              <div style={{ marginTop: 9, height: 16, display: 'flex', alignItems: 'center' }}>
                {saveStatus === 'saving' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6E6B82' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Saving
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2EC882' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Saved
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>

          {/* HUB VIEW */}
          {view === 'hub' && (
            <>
              <button
                onClick={() => setView('scenes')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '16px 4px',
                  border: 'none', borderBottom: '1px solid rgba(255,255,255,0.055)',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{
                  flexShrink: 0, width: 42, height: 42, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(124,92,252,0.14)', color: '#9F7AEA',
                  boxShadow: '0 0 18px rgba(124,92,252,0.18)',
                }}>
                  <Sparkles size={19} />
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 500, color: '#E9E7F2' }}>Scenes</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#6E6B82' }}>Brightness moods per room</span>
                </span>
                <ChevronRight size={19} color="#6E6B82" />
              </button>

              {COMING_SOON.map(({ name, Icon }) => (
                <div
                  key={name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    width: '100%', padding: '16px 4px',
                    borderBottom: '1px solid rgba(255,255,255,0.055)',
                    opacity: 0.45, cursor: 'not-allowed',
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 42, height: 42, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#1A1927', color: '#6E6B82',
                  }}>
                    <Icon size={19} />
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 500, color: '#E9E7F2' }}>{name}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#6E6B82',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999,
                    padding: '3px 9px', flexShrink: 0,
                  }}>
                    Soon
                  </span>
                </div>
              ))}
              <div style={{ height: 14 }} />
            </>
          )}

          {/* SCENES VIEW */}
          {view === 'scenes' && (
            <>
              {/* Room pills */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {ROOMS.map(room => {
                  const RoomIcon = ROOM_ICONS[room.icon]
                  const isActive = activeRoomId === room.id
                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 16px', borderRadius: 999, border: '1px solid',
                        borderColor: isActive ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.09)',
                        background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
                        color: isActive ? '#9F7AEA' : '#6E6B82',
                        fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500,
                        whiteSpace: 'nowrap', cursor: 'pointer',
                        transition: 'all 150ms', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {RoomIcon && <RoomIcon size={15} />}
                      {room.name}
                    </button>
                  )
                })}
              </div>

              {/* Scene pills */}
              <div style={{ marginTop: 10, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {['relax', 'bright'].map(sceneId => {
                  const { label, Icon } = SCENE_META[sceneId]
                  const isActive = activeScene === sceneId
                  return (
                    <button
                      key={sceneId}
                      onClick={() => setActiveScene(sceneId)}
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 16px', borderRadius: 999, border: '1px solid',
                        borderColor: isActive ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.09)',
                        background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
                        color: isActive ? '#9F7AEA' : '#6E6B82',
                        fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 150ms', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Light rows */}
              <div style={{ marginTop: 4 }}>
                {activeRoom.lights.map(light => {
                  const s = sceneStates[light.id] ?? { on: false, b: 0 }
                  const effectiveB = s.on ? s.b : 0
                  return (
                    <LightRow
                      key={light.id}
                      light={light}
                      effectiveB={effectiveB}
                      onSelect={p => { markSaving(); onUpdateLight(activeRoomId, activeScene, light.id, p === 0 ? { on: false, b: 0 } : { on: true, b: p }) }}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer — scenes only */}
        {view === 'scenes' && (
          <div style={{ flexShrink: 0, padding: '16px 22px 34px' }}>
            <button
              onClick={() => { markSaving(); onResetRoom(activeRoomId) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                background: 'transparent', border: 'none', padding: 0,
                color: '#6E6B82', fontFamily: 'var(--font-sans)', fontSize: 14,
                cursor: 'pointer', transition: 'color 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#9F7AEA' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6E6B82' }}
            >
              <RotateCcw size={16} />
              <span>Reset {activeRoom.name} to defaults</span>
            </button>
          </div>
        )}

        {/* Hub bottom spacer */}
        {view === 'hub' && <div style={{ flexShrink: 0, height: 22 }} />}
      </div>
    </div>
  )
}

function LightRow({ light, effectiveB, onSelect }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          flex: 1, fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 500,
          color: '#E9E7F2',
        }}>
          {light.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.04em',
          color: effectiveB > 0 ? '#9F7AEA' : 'rgba(255,255,255,0.28)',
          transition: 'color 200ms',
        }}>
          {effectiveB === 0 ? 'Off' : `${effectiveB}%`}
        </span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 7 }}>
        {PRESETS.map(p => {
          const isActive = effectiveB === p
          return (
            <button
              key={p}
              onClick={() => onSelect(p)}
              style={{
                flex: '1 1 0', minWidth: 0, padding: '8px 2px',
                borderRadius: 9, border: '1px solid',
                borderColor: isActive ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.09)',
                background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
                color: isActive ? '#9F7AEA' : '#6E6B82',
                fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.02em',
                textAlign: 'center', cursor: 'pointer',
                transition: 'all 120ms', WebkitTapHighlightColor: 'transparent',
              }}
            >
              {p === 0 ? 'Off' : `${p}%`}
            </button>
          )
        })}
      </div>
    </div>
  )
}
