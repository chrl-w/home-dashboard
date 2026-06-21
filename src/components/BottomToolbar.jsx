import { ListTodo, Blinds, Moon, Thermometer, Settings } from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { ROOMS } from '../data/rooms.js'

export function BottomToolbar({ lightStates, blindStates, onAllLightsToggle, onBlindsToggle, onGoodnight, onSettings }) {
  const { signOut } = useHA() || {}

  const anyLightOn = ROOMS.some(room =>
    room.lights.some(l => lightStates[room.id]?.[l.id]?.on)
  )

  const anyBlindClosed = ROOMS.some(room =>
    room.blinds && (blindStates[room.id]?.left < 100 || blindStates[room.id]?.right < 100)
  )

  const accentColor = 'var(--primary-grad-to)'
  const mutedColor = 'var(--text-muted)'

  return (
    <div style={{
      position: 'fixed',
      left: 14,
      right: 14,
      bottom: 'max(24px, env(safe-area-inset-bottom))',
      height: 74,
      zIndex: 20,
    }}>
      {/* Frosted glass backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 26,
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0,0,0,.5)',
        border: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'color-mix(in srgb, var(--surface-card) 88%, transparent)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        }} />
      </div>

      {/* Buttons */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>

        {/* To dos */}
        <ToolbarBtn
          icon={<ListTodo size={23} strokeWidth={1.9} />}
          label="To dos"
          color={mutedColor}
          onClick={() => {}}
        />

        {/* Blinds toggle */}
        <ToolbarBtn
          icon={<Blinds size={23} strokeWidth={1.9} />}
          label="Blinds"
          color={anyBlindClosed ? accentColor : mutedColor}
          onClick={onBlindsToggle}
        />

        {/* Goodnight — raised center primary */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={onGoodnight}
            style={{
              position: 'absolute',
              top: -34,
              width: 62,
              height: 62,
              borderRadius: 9999,
              background: 'var(--primary)',
              color: 'var(--primary-foreground, #0d0c18)',
              border: '4px solid #0d0c18',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 28px var(--accent-glow), 0 10px 24px rgba(0,0,0,.45)',
              transition: 'transform 150ms var(--ease-pos), opacity 150ms',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
            onPointerUp={e => e.currentTarget.style.transform = ''}
            onPointerLeave={e => e.currentTarget.style.transform = ''}
          >
            <Moon size={26} strokeWidth={2} />
          </button>
          <span style={{
            marginTop: 36,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            color: 'var(--primary)',
          }}>
            Goodnight
          </span>
        </div>

        {/* Climate — stub */}
        <ToolbarBtn
          icon={<Thermometer size={23} strokeWidth={1.9} />}
          label="Climate"
          color={mutedColor}
          onClick={() => {}}
        />

        {/* Settings */}
        <ToolbarBtn
          icon={<Settings size={23} strokeWidth={1.9} />}
          label="Settings"
          color={mutedColor}
          onClick={onSettings}
        />

      </div>
    </div>
  )
}

function ToolbarBtn({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 0,
        color,
        fontFamily: 'var(--font-sans)',
        transition: 'opacity 150ms',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => e.currentTarget.style.opacity = '0.6'}
      onPointerUp={e => e.currentTarget.style.opacity = ''}
      onPointerLeave={e => e.currentTarget.style.opacity = ''}
    >
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    </button>
  )
}
