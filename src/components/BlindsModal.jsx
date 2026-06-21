import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { ROOMS } from '../data/rooms.js'

const LIVING = ROOMS.find(r => r.id === 'living')

const PRESETS = [
  { label: 'Closed', value: 0 },
  { label: '25%',    value: 25 },
  { label: '50%',    value: 50 },
  { label: '75%',    value: 75 },
  { label: 'Open',   value: 100 },
]

function posLabel(pos) {
  if (pos === 0)  return 'Fully closed'
  if (pos <= 30)  return 'Mostly closed'
  if (pos <= 60)  return 'Partially open'
  if (pos < 100)  return 'Mostly open'
  return 'Fully open'
}

export function BlindsModal({ blindStates, onBlindChange, onClose }) {
  const { callService, entities } = useHA() || {}
  const overlayRef = useRef(null)

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const left  = blindStates?.living?.left  ?? 100
  const right = blindStates?.living?.right ?? 100
  const inSync = left === right
  const displayPos = inSync ? left : Math.round((left + right) / 2)

  const reason = entities?.['input_select.living_room_blinds_reason']?.state

  function setBlind(side, v) { onBlindChange('living', side, v) }
  function setBoth(v) { onBlindChange('living', 'left', v); onBlindChange('living', 'right', v) }

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div style={{
        width: '100%',
        background: 'var(--surface-card)',
        borderRadius: '24px 24px 0 0',
        border: '1px solid var(--border)', borderBottom: 'none',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 20px 16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--text-body)' }}>
              Living room blinds
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 3 }}>
              Both panels · Left + Right
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Blind graphic */}
        <div style={{ padding: '0 20px 16px' }}>
          <BlindGraphic position={displayPos} onChange={setBoth} />
        </div>

        {/* Position + label + reason */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--text-body)', lineHeight: 1 }}>
              {displayPos}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-muted)' }}>%</span>
            {!inSync && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                (out of sync)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--primary-grad-to)' }}>
              {posLabel(displayPos)}
            </span>
            {reason && (
              <>
                <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>
                  Last closed by {reason.toLowerCase()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 7, padding: '0 20px 20px' }}>
          {PRESETS.map(p => {
            const active = inSync && left === p.value
            return (
              <button key={p.value} onClick={() => setBoth(p.value)} style={{
                flex: 1, padding: '10px 0', borderRadius: 12,
                border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                background: active ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'var(--surface-secondary)',
                color: active ? 'var(--primary-grad-to)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent', transition: 'all 120ms',
              }}>
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Individual left / right */}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 20px 16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }}>
          {['left', 'right'].map(side => {
            const pos = side === 'left' ? left : right
            return (
              <div key={side}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={miniLabelStyle}>{side === 'left' ? '← Left' : 'Right →'}</span>
                  <span style={{ ...miniLabelStyle, color: 'var(--primary-grad-to)' }}>{pos}%</span>
                </div>
                <MiniSlider value={pos} onChange={v => setBlind(side, v)} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Blind graphic ─────────────────────────────────────────────────────────────

function BlindGraphic({ position, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  function posFromY(clientY) {
    const rect = ref.current.getBoundingClientRect()
    const frac = (clientY - rect.top) / rect.height
    return Math.round(Math.max(0, Math.min(100, (1 - frac) * 100)))
  }

  const railPct  = (1 - position / 100) * 100
  const lightPct = 100 - railPct

  return (
    <div
      ref={ref}
      onPointerDown={e => { e.preventDefault(); dragging.current = true; ref.current.setPointerCapture(e.pointerId); onChange(posFromY(e.clientY)) }}
      onPointerMove={e => { if (dragging.current) onChange(posFromY(e.clientY)) }}
      onPointerUp={() => { dragging.current = false }}
      style={{
        position: 'relative', height: 210, borderRadius: 16,
        overflow: 'hidden', cursor: 'ns-resize',
        border: '1px solid var(--border)', userSelect: 'none',
      }}
    >
      {/* Slat area */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${railPct}%`,
        background: 'var(--surface-secondary)',
        overflow: 'hidden',
      }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${(i / 14) * 100}%`, height: 1.5,
            background: 'color-mix(in srgb, var(--border) 220%, transparent)',
          }} />
        ))}
      </div>

      {/* Daylight area */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        top: `${railPct}%`,
        background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 30%, #fde68a 65%, #fefce8 100%)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: 12, overflow: 'hidden',
      }}>
        {/* Light rays overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <Plant position={position} lightPct={lightPct} />
      </div>

      {/* Rail handle */}
      <div style={{
        position: 'absolute', left: 8, right: 8,
        top: `${railPct}%`, transform: 'translateY(-50%)',
        height: 28, borderRadius: 10, zIndex: 2, pointerEvents: 'none',
        background: 'var(--primary)',
        boxShadow: '0 2px 16px color-mix(in srgb, var(--primary) 50%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: 4, fontSize: 11 }}>• • •</span>
      </div>

      <Pill pos={{ top: 8 }}>↑ OPEN</Pill>
      <Pill pos={{ bottom: 8 }}>↓ CLOSED</Pill>
    </div>
  )
}

function Pill({ children, pos }) {
  return (
    <div style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.32)', borderRadius: 20, padding: '3px 10px',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
      color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em',
      whiteSpace: 'nowrap', zIndex: 3, pointerEvents: 'none',
      ...pos,
    }}>
      {children}
    </div>
  )
}

// ─── Plant character ──────────────────────────────────────────────────────────

function Plant({ position, lightPct }) {
  const visible  = Math.min(1, lightPct / 22)
  const slideUp  = Math.max(0, (1 - lightPct / 35) * 40)
  const growth   = position / 100

  // Stem grows upward
  const stemH     = 18 + growth * 46   // 18 → 64
  const cx        = 40
  const potTop    = 88
  const stemBase  = potTop - 2
  const stemTip   = stemBase - stemH

  // Leaves spread and lift as growth increases
  const leafSpread  = 8 + growth * 20
  const leafLift    = growth * 12
  const leafOpacity = Math.min(1, (position - 10) / 40)

  // Flower appears after 55%
  const flowerOpacity = Math.max(0, (position - 55) / 45)
  const petalR = 3 + growth * 5

  const stemColor  = '#3d7a32'
  const leafColor  = '#4a9a3e'
  const potColor   = '#9b6240'
  const potDark    = '#7a4a2e'
  const soilColor  = '#5c3520'

  return (
    <svg
      viewBox="0 0 80 100"
      width="72" height="90"
      style={{
        opacity: visible,
        transform: `translateY(${slideUp}px)`,
        transition: 'opacity 400ms ease, transform 400ms ease',
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      {/* Pot */}
      <path d={`M${cx-15} ${potTop} L${cx-11} 100 L${cx+11} 100 L${cx+15} ${potTop} Z`} fill={potColor} />
      <ellipse cx={cx} cy={potTop} rx="15" ry="3.5" fill={potDark} />
      <ellipse cx={cx} cy={potTop} rx="12" ry="2.5" fill={soilColor} />

      {/* Stem — gently curved */}
      <path
        d={`M${cx} ${stemBase} Q${cx + 4} ${stemBase - stemH * 0.5} ${cx} ${stemTip}`}
        stroke={stemColor} strokeWidth="3.5" fill="none" strokeLinecap="round"
      />

      {/* Left leaf */}
      <path
        d={`M${cx} ${stemBase - stemH * 0.42}
            C${cx - leafSpread * 0.6} ${stemBase - stemH * 0.42 - leafLift}
              ${cx - leafSpread} ${stemBase - stemH * 0.52 - leafLift}
              ${cx - leafSpread * 0.3} ${stemBase - stemH * 0.56 - leafLift}`}
        stroke={leafColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
        opacity={leafOpacity}
      />

      {/* Right leaf */}
      <path
        d={`M${cx + 3} ${stemBase - stemH * 0.62}
            C${cx + leafSpread * 0.6} ${stemBase - stemH * 0.62 - leafLift}
              ${cx + leafSpread} ${stemBase - stemH * 0.72 - leafLift}
              ${cx + leafSpread * 0.3} ${stemBase - stemH * 0.76 - leafLift}`}
        stroke={leafColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
        opacity={leafOpacity}
      />

      {/* Flower — petals then centre */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
        const rad = (angle * Math.PI) / 180
        const px  = cx + Math.cos(rad) * (petalR + 2)
        const py  = stemTip + Math.sin(rad) * (petalR + 2)
        return (
          <ellipse
            key={angle}
            cx={px} cy={py}
            rx={petalR * 0.85} ry={petalR * 0.6}
            transform={`rotate(${angle}, ${px}, ${py})`}
            fill="#fbbf24"
            opacity={flowerOpacity * 0.92}
          />
        )
      })}
      <circle cx={cx} cy={stemTip} r={petalR * 0.72} fill="#92400e" opacity={flowerOpacity} />
      <circle cx={cx} cy={stemTip} r={petalR * 0.42} fill="#b45309" opacity={flowerOpacity} />
    </svg>
  )
}

// ─── Mini horizontal slider ───────────────────────────────────────────────────

function MiniSlider({ value, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  function getVal(clientX) {
    const rect = ref.current.getBoundingClientRect()
    return Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      onPointerDown={e => { e.preventDefault(); dragging.current = true; ref.current.setPointerCapture(e.pointerId); onChange(getVal(e.clientX)) }}
      onPointerMove={e => { if (dragging.current) onChange(getVal(e.clientX)) }}
      onPointerUp={() => { dragging.current = false }}
      style={{ height: 28, display: 'flex', alignItems: 'center', cursor: 'ew-resize' }}
    >
      <div style={{ position: 'relative', flex: 1, height: 4, borderRadius: 2, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value}%`, background: 'var(--primary)', borderRadius: 2 }} />
        <div style={{
          position: 'absolute', left: `${value}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: 9999,
          background: 'var(--primary)', border: '2.5px solid var(--background)',
          boxShadow: '0 1px 6px color-mix(in srgb, var(--primary) 40%, transparent)',
        }} />
      </div>
    </div>
  )
}

const miniLabelStyle = {
  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)',
}
