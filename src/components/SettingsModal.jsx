import { useRef, useState, useEffect } from 'react'
import { X, Moon, Lightbulb, RotateCcw, Sofa, Bed, UtensilsCrossed, DoorOpen, Bath, ArrowUpNarrowWide } from 'lucide-react'
import { ROOMS } from '../data/rooms.js'

const SCENE_META = {
  relax:  { label: 'Relax',  Icon: Moon },
  bright: { label: 'Bright', Icon: Lightbulb },
}

const ROOM_ICONS = { Sofa, Bed, UtensilsCrossed, DoorOpen, Bath, ArrowUpNarrowWide }

const PRESETS = [0, 10, 30, 60, 100]

export function SettingsModal({ settings, onUpdateLight, onResetRoom, onClose }) {
  const overlayRef = useRef(null)
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
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div style={{
        width: '100%',
        height: '86dvh',
        background: 'var(--surface-card)',
        borderRadius: '24px 24px 0 0',
        border: '1px solid var(--border)', borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 20px 12px', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--text-body)' }}>
              Scene settings
            </div>
            <div style={{ marginTop: 6, height: 16, display: 'flex', alignItems: 'center' }}>
              {saveStatus === 'saving' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Saving
                </span>
              )}
              {saveStatus === 'saved' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2EC882' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  Saved
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Room pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 10px', flexShrink: 0, overflowX: 'auto' }}>
          {ROOMS.map(room => {
            const RoomIcon = ROOM_ICONS[room.icon]
            const isActive = activeRoomId === room.id
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 999, border: '1px solid',
                  borderColor: isActive ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.09)',
                  background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
                  color: isActive ? 'var(--primary-grad-to)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 150ms', WebkitTapHighlightColor: 'transparent',
                }}
              >
                {RoomIcon && <RoomIcon size={14} />}
                {room.name}
              </button>
            )
          })}
        </div>

        {/* Scene pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 14px', flexShrink: 0 }}>
          {['relax', 'bright'].map(sceneId => {
            const { label, Icon } = SCENE_META[sceneId]
            const isActive = activeScene === sceneId
            return (
              <button
                key={sceneId}
                onClick={() => setActiveScene(sceneId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 999, border: '1px solid',
                  borderColor: isActive ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.09)',
                  background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
                  color: isActive ? 'var(--primary-grad-to)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms', WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Scrollable light list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
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

          <button
            onClick={() => { markSaving(); onResetRoom(activeRoomId) }}
            style={{
              margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '6px 0',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            }}
          >
            <RotateCcw size={13} />
            Reset {activeRoom.name} to defaults
          </button>
        </div>
      </div>
    </div>
  )
}

function LightRow({ light, effectiveB, onSelect }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500,
          color: effectiveB > 0 ? 'var(--text-body)' : 'var(--text-muted)',
          transition: 'color 200ms',
        }}>
          {light.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
          color: effectiveB > 0 ? 'var(--primary-grad-to)' : 'rgba(255,255,255,0.28)',
          transition: 'color 200ms',
        }}>
          {effectiveB === 0 ? 'Off' : `${effectiveB}%`}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
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
                color: isActive ? 'var(--primary-grad-to)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
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
