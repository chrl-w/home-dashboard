import { useRef } from 'react'

export function BlindSlider({ label, value, onChange }) {
  const trackRef = useRef(null)
  const dragging = useRef(false)

  function getPosition(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
  }

  function handlePointerDown(e) {
    e.preventDefault()
    dragging.current = true
    trackRef.current.setPointerCapture(e.pointerId)
    onChange(getPosition(e.clientX))
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    onChange(getPosition(e.clientX))
  }

  function handlePointerUp() {
    dragging.current = false
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>
          {value}%
        </span>
      </div>
      <div
        className="pos-slider"
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') onChange(Math.min(100, value + 5))
          if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 5))
        }}
      >
        <div className="pos-slider__track">
          <div className="pos-slider__fill" style={{ width: `${value}%` }} />
          <div className="pos-slider__thumb" style={{ left: `${value}%` }} />
        </div>
      </div>
    </div>
  )
}
