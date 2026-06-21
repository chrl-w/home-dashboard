import { useRef, useState, useEffect } from 'react'
import { X, Moon, Lightbulb, RotateCcw } from 'lucide-react'
import { ROOMS } from '../data/rooms.js'

const SCENE_META = {
  relax:  { label: 'Relax',  Icon: Moon },
  bright: { label: 'Bright', Icon: Lightbulb },
}

const PRESETS = [0, 10, 20, 40, 60, 80, 100]

export function SettingsModal({ settings, onUpdateLight, onResetRoom, onClose }) {
  const overlayRef = useRef(null)
  const [activeRoomId, setActiveRoomId] = useState(ROOMS[0].id)
  const [activeScene, setActiveScene] = useState('relax')

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
        maxHeight: '90dvh',
        background: 'var(--surface-card)',
        borderRadius: '24px 24px 0 0',
        border: '1px solid var(--border)', borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 3 }}>
              {activeRoom.name} · {SCENE_META[activeScene].label}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Room tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '0 20px 12px', flexShrink: 0, overflowX: 'auto' }}>
          {ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: activeRoomId === room.id ? 'var(--primary)' : 'var(--border)',
                background: activeRoomId === room.id ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'transparent',
                color: activeRoomId === room.id ? 'var(--primary-grad-to)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Scene tabs */}
        <div style={{ display: 'flex', gap: 0, margin: '0 20px 16px', flexShrink: 0, background: 'var(--surface-secondary)', borderRadius: 12, padding: 3, border: '1px solid var(--border)' }}>
          {['relax', 'bright'].map(sceneId => {
            const { label, Icon } = SCENE_META[sceneId]
            const isActive = activeScene === sceneId
            return (
              <button
                key={sceneId}
                onClick={() => setActiveScene(sceneId)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 0',
                  borderRadius: 9,
                  border: 'none',
                  background: isActive ? 'var(--surface-card)' : 'transparent',
                  color: isActive ? 'var(--text-body)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 150ms',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon size={13} color={isActive ? 'var(--primary-grad-to)' : 'currentColor'} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Light list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeRoom.lights.map(light => {
              const s = sceneStates[light.id] ?? { on: false, b: 100 }
              return (
                <LightRow
                  key={light.id}
                  light={light}
                  on={s.on}
                  brightness={s.b}
                  onToggle={() => onUpdateLight(activeRoomId, activeScene, light.id, { on: !s.on })}
                  onBrightness={val => onUpdateLight(activeRoomId, activeScene, light.id, { b: val })}
                />
              )
            })}
          </div>

          {/* Reset */}
          <button
            onClick={() => onResetRoom(activeRoomId)}
            style={{
              marginTop: 20, display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '6px 0',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
            }}
          >
            <RotateCcw size={12} />
            Reset {activeRoom.name} to defaults
          </button>
        </div>
      </div>
    </div>
  )
}

function LightRow({ light, on, brightness, onToggle, onBrightness }) {
  const isCustom = !PRESETS.includes(brightness)
  const [customMode, setCustomMode] = useState(isCustom)
  const [customVal, setCustomVal] = useState(String(brightness))
  const inputRef = useRef(null)

  useEffect(() => {
    if (customMode && inputRef.current) inputRef.current.focus()
  }, [customMode])

  function handleCustomConfirm() {
    const n = Math.max(0, Math.min(100, parseInt(customVal, 10) || 0))
    onBrightness(n)
    setCustomVal(String(n))
    if (PRESETS.includes(n)) setCustomMode(false)
  }

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Toggle on={on} onChange={onToggle} />
        <span style={{
          flex: 1,
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
          color: on ? 'var(--text-body)' : 'var(--text-muted)',
          transition: 'color 200ms',
        }}>
          {light.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          color: on ? 'var(--primary-grad-to)' : 'var(--border)',
          minWidth: 32, textAlign: 'right',
          transition: 'color 200ms',
        }}>
          {on ? `${brightness}%` : 'off'}
        </span>
      </div>

      <div style={{ paddingLeft: 46, opacity: on ? 1 : 0.3, transition: 'opacity 200ms', pointerEvents: on ? 'auto' : 'none', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { onBrightness(p); setCustomMode(false) }}
            style={{
              padding: '4px 7px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: (!customMode && brightness === p) ? 'var(--primary)' : 'var(--border)',
              background: (!customMode && brightness === p) ? 'color-mix(in srgb, var(--primary) 18%, transparent)' : 'transparent',
              color: (!customMode && brightness === p) ? 'var(--primary-grad-to)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 120ms',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {p}%
          </button>
        ))}

        {customMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              ref={inputRef}
              type="number"
              min={0} max={100}
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              onBlur={handleCustomConfirm}
              onKeyDown={e => e.key === 'Enter' && handleCustomConfirm()}
              style={{
                width: 48, padding: '4px 6px',
                borderRadius: 6, border: '1px solid var(--primary)',
                background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                color: 'var(--primary-grad-to)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                outline: 'none',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>%</span>
          </div>
        ) : (
          <button
            onClick={() => { setCustomVal(String(brightness)); setCustomMode(true) }}
            style={{
              padding: '4px 7px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: isCustom ? 'var(--primary)' : 'var(--border)',
              background: isCustom ? 'color-mix(in srgb, var(--primary) 18%, transparent)' : 'transparent',
              color: isCustom ? 'var(--primary-grad-to)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 120ms',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            custom
          </button>
        )}
      </div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 38, height: 22, borderRadius: 11, flexShrink: 0,
        background: on ? 'var(--primary)' : 'var(--border)',
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', transition: 'background 200ms',
        boxShadow: on ? '0 0 10px color-mix(in srgb, var(--primary) 40%, transparent)' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3, left: on ? 19 : 3,
        width: 16, height: 16, borderRadius: 9999,
        background: 'white',
        transition: 'left 180ms',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}
