import { useRef } from 'react'
import * as Icons from 'lucide-react'

export function Dimmer({ light, brightness, on, onToggle, onBrightnessChange }) {
  const rowRef = useRef(null)
  const dragging = useRef(false)
  const Icon = Icons[light.icon] || Icons.Lightbulb

  function getBrightness(clientX) {
    const rect = rowRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
    return pct
  }

  function handlePointerDown(e) {
    if (e.target.closest('.pos-dimmer__toggle')) return
    e.preventDefault()
    dragging.current = true
    rowRef.current.setPointerCapture(e.pointerId)
    const b = getBrightness(e.clientX)
    onBrightnessChange(b === 0 ? 1 : b, true)
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    const b = getBrightness(e.clientX)
    onBrightnessChange(b === 0 ? 1 : b, true)
  }

  function handlePointerUp() {
    dragging.current = false
  }

  const fillWidth = on ? `${brightness}%` : '0%'
  const iconColor = on ? 'var(--primary-grad-to)' : 'var(--text-muted)'
  const valLabel = on ? `${brightness}%` : 'Off'

  return (
    <div
      ref={rowRef}
      className="pos-dimmer"
      role="slider"
      aria-label={light.name}
      aria-valuenow={on ? brightness : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') onBrightnessChange(Math.min(100, brightness + 5), on)
        if (e.key === 'ArrowLeft') onBrightnessChange(Math.max(0, brightness - 5), on)
        if (e.key === ' ') { e.preventDefault(); onToggle() }
      }}
      tabIndex={0}
    >
      <div className="pos-dimmer__fill" style={{ width: fillWidth }} />
      <div className="pos-dimmer__body">
        <span className="pos-dimmer__icon">
          <Icon size={16} strokeWidth={1.75} color={iconColor} />
        </span>
        <span className="pos-dimmer__name">{light.name}</span>
        <span className="pos-dimmer__val">{valLabel}</span>
        <button
          className="pos-dimmer__toggle"
          onClick={e => { e.stopPropagation(); onToggle() }}
          aria-label={on ? 'Turn off' : 'Turn on'}
        >
          {on && <span className="pos-dimmer__dot" />}
        </button>
      </div>
    </div>
  )
}
