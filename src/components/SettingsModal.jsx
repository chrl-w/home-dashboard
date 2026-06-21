import { useRef } from 'react'
import { X, Moon, Lightbulb, RotateCcw } from 'lucide-react'
import { ROOMS } from '../data/rooms.js'

const SCENE_META = {
  relax:  { label: 'Relax',  Icon: Moon },
  bright: { label: 'Bright', Icon: Lightbulb },
}

export function SettingsModal({ settings, onUpdateLight, onResetRoom, onClose }) {
  const overlayRef = useRef(null)

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 20px 16px', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--text-body)' }}>
              Scene settings
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 3 }}>
              Relax &amp; Bright · per room
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 8px' }}>
          {ROOMS.map(room => (
            <RoomSection
              key={room.id}
              room={room}
              settings={settings[room.id] ?? {}}
              onUpdateLight={(sceneId, lightId, patch) => onUpdateLight(room.id, sceneId, lightId, patch)}
              onReset={() => onResetRoom(room.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RoomSection({ room, settings, onUpdateLight, onReset }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Room header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {room.name}
        </span>
        <button
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 4 }}
          title="Reset to defaults"
        >
          <RotateCcw size={12} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500 }}>Reset</span>
        </button>
      </div>

      {/* Scene cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['relax', 'bright'].map(sceneId => {
          const scene = room.scenes.find(s => s.id === sceneId)
          if (!scene) return null
          const sceneStates = settings[sceneId] ?? scene.states
          return (
            <SceneCard
              key={sceneId}
              sceneId={sceneId}
              room={room}
              sceneStates={sceneStates}
              onUpdateLight={(lightId, patch) => onUpdateLight(sceneId, lightId, patch)}
            />
          )
        })}
      </div>
    </div>
  )
}

function SceneCard({ sceneId, room, sceneStates, onUpdateLight }) {
  const { label, Icon } = SCENE_META[sceneId]
  const onCount = room.lights.filter(l => sceneStates[l.id]?.on).length

  return (
    <div style={{
      background: 'var(--surface-secondary)',
      borderRadius: 16, padding: '14px 16px',
      border: '1px solid var(--border)',
    }}>
      {/* Scene header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon size={14} color="var(--primary-grad-to)" />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-body)' }}>
            {label}
          </span>
        </div>
        {/* At-a-glance summary */}
        <GlanceSummary room={room} sceneStates={sceneStates} onCount={onCount} />
      </div>

      {/* Light rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {room.lights.map(light => {
          const s = sceneStates[light.id] ?? { on: false, b: 100 }
          return (
            <LightRow
              key={light.id}
              light={light}
              on={s.on}
              brightness={s.b}
              onToggle={() => onUpdateLight(light.id, { on: !s.on })}
              onBrightness={val => onUpdateLight(light.id, { b: val })}
            />
          )
        })}
      </div>
    </div>
  )
}

function GlanceSummary({ room, sceneStates, onCount }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {room.lights.map(light => {
          const s = sceneStates[light.id] ?? { on: false, b: 100 }
          return (
            <div
              key={light.id}
              title={`${light.name}: ${s.on ? `${s.b}%` : 'off'}`}
              style={{
                width: 8, height: 8, borderRadius: 9999,
                background: s.on
                  ? `color-mix(in srgb, var(--primary-grad-to) ${s.b}%, color-mix(in srgb, var(--primary-grad-to) 20%, transparent))`
                  : 'var(--border)',
                transition: 'background 200ms',
              }}
            />
          )
        })}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
        {onCount}/{room.lights.length}
      </span>
    </div>
  )
}

function LightRow({ light, on, brightness, onToggle, onBrightness }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
      {on && (
        <div style={{ paddingLeft: 46, paddingTop: 8 }}>
          <SceneSlider value={brightness} onChange={onBrightness} />
        </div>
      )}
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

function SceneSlider({ value, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  function getVal(clientX) {
    const rect = ref.current.getBoundingClientRect()
    return Math.round(Math.max(1, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      onPointerDown={e => { e.preventDefault(); dragging.current = true; ref.current.setPointerCapture(e.pointerId); onChange(getVal(e.clientX)) }}
      onPointerMove={e => { if (dragging.current) onChange(getVal(e.clientX)) }}
      onPointerUp={() => { dragging.current = false }}
      style={{ height: 24, display: 'flex', alignItems: 'center', cursor: 'ew-resize' }}
    >
      <div style={{ position: 'relative', flex: 1, height: 4, borderRadius: 2, background: 'var(--border)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value}%`, background: 'var(--primary)', borderRadius: 2 }} />
        <div style={{
          position: 'absolute', left: `${value}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: 9999,
          background: 'var(--primary)', border: '2.5px solid var(--background)',
          boxShadow: '0 1px 4px color-mix(in srgb, var(--primary) 40%, transparent)',
        }} />
      </div>
    </div>
  )
}
