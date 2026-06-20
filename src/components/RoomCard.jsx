import { useState, useRef, useEffect } from 'react'
import { ChevronRight, Power, Moon, Lightbulb, Blinds } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Dimmer } from './Dimmer.jsx'
import { BlindSlider } from './BlindSlider.jsx'
import { useHA } from '../ha/HAProvider.jsx'

const SCENE_ICONS = { Power, Moon, Lightbulb }

function deriveActiveScene(scenes, lightStates) {
  for (const scene of scenes) {
    if (scene.id === 'off') {
      const allOff = Object.values(lightStates).every(s => !s.on)
      if (allOff) return 'off'
      continue
    }
    const match = Object.entries(scene.states).every(([id, target]) => {
      const cur = lightStates[id]
      if (!cur) return false
      if (target.on !== cur.on) return false
      if (target.on && Math.abs((cur.b || 0) - target.b) > 2) return false
      return true
    })
    if (match) return scene.id
  }
  return null
}

function getRoomSubtitle(room, lightStates, blindStates) {
  const onCount = room.lights.filter(l => lightStates[l.id]?.on).length
  const total = room.lights.length
  if (onCount === 0) return 'All off'
  let s = onCount === total ? 'All lights on' : `${onCount} of ${total} lights on`
  if (room.blinds && blindStates) {
    const avg = Math.round((blindStates.left + blindStates.right) / 2)
    s += ` · blinds ${avg}%`
  }
  return s
}

export function RoomCard({ room, lightStates, blindStates, expanded, onToggleExpand, onLightChange, onBlindChange, onScene }) {
  const { callService } = useHA() || {}
  const detailRef = useRef(null)
  const [detailHeight, setDetailHeight] = useState(0)
  const RoomIcon = Icons[room.icon] || Icons.Home
  const anyOn = room.lights.some(l => lightStates[l.id]?.on)
  const glowOpacity = room.lights.filter(l => lightStates[l.id]?.on).length / room.lights.length
  const activeScene = deriveActiveScene(room.scenes, lightStates)

  useEffect(() => {
    if (detailRef.current) {
      setDetailHeight(expanded ? detailRef.current.scrollHeight : 0)
    }
  }, [expanded, lightStates, blindStates])

  function applyScene(scene) {
    const nextStates = {}
    if (scene.id === 'off') {
      room.lights.forEach(l => {
        nextStates[l.id] = { on: false, b: lightStates[l.id]?.b ?? 0 }
        if (l.entityId && callService) callService('light', 'turn_off', { entity_id: l.entityId })
      })
    } else {
      room.lights.forEach(l => {
        const target = scene.states[l.id]
        if (target) {
          nextStates[l.id] = { on: target.on, b: target.b }
          if (l.entityId && callService) {
            if (target.on) callService('light', 'turn_on', { entity_id: l.entityId, brightness_pct: target.b })
            else callService('light', 'turn_off', { entity_id: l.entityId })
          }
        } else {
          nextStates[l.id] = { on: false, b: lightStates[l.id]?.b ?? 0 }
          if (l.entityId && callService) callService('light', 'turn_off', { entity_id: l.entityId })
        }
      })
    }
    onScene(room.id, nextStates)
  }

  function handleDimmer(lightId, brightness, turnOn) {
    const light = room.lights.find(l => l.id === lightId)
    onLightChange(room.id, lightId, { on: turnOn, b: brightness })
    if (light?.entityId && callService) {
      if (turnOn && brightness > 0) callService('light', 'turn_on', { entity_id: light.entityId, brightness_pct: brightness })
      else callService('light', 'turn_off', { entity_id: light.entityId })
    }
  }

  function handleToggle(lightId) {
    const cur = lightStates[lightId] || { on: false, b: 100 }
    const next = { on: !cur.on, b: cur.b || 100 }
    const light = room.lights.find(l => l.id === lightId)
    onLightChange(room.id, lightId, next)
    if (light?.entityId && callService) {
      if (next.on) callService('light', 'turn_on', { entity_id: light.entityId, brightness_pct: next.b })
      else callService('light', 'turn_off', { entity_id: light.entityId })
    }
  }

  return (
    <div className={`pos-room-card${anyOn ? ' pos-room-card--on' : ''}`}>
      <div
        className="pos-room-card__glow"
        style={{ opacity: anyOn ? Math.max(0.3, glowOpacity) : 0 }}
      />

      {/* Header */}
      <div
        onClick={onToggleExpand}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <div className={`pos-icon-tile${anyOn ? ' pos-icon-tile--on' : ''}`}>
          <RoomIcon
            size={21}
            strokeWidth={1.75}
            color={anyOn ? 'var(--primary-grad-to)' : 'var(--text-body)'}
            style={{ opacity: anyOn ? 1 : 0.6 }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-body)',
            lineHeight: 1.3,
          }}>
            {room.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginTop: 2,
          }}>
            {getRoomSubtitle(room, lightStates, blindStates)}
          </div>
        </div>
        <ChevronRight
          size={18}
          strokeWidth={1.75}
          color="var(--text-muted)"
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.28s var(--ease-pos)',
            flex: 'none',
          }}
        />
      </div>

      {/* Scene chips — always visible */}
      <div className="pos-scroll-row" style={{ padding: '0 16px 14px', gap: 7 }}>
        {room.scenes.map(scene => {
          const SceneIcon = SCENE_ICONS[scene.icon] || Icons[scene.icon] || Power
          const isActive = activeScene === scene.id
          return (
            <button
              key={scene.id}
              className={`pos-scene-chip${isActive ? ' pos-scene-chip--active' : ''}`}
              onClick={e => { e.stopPropagation(); applyScene(scene) }}
            >
              <SceneIcon size={13} strokeWidth={1.75} />
              {scene.name}
            </button>
          )
        })}
      </div>

      {/* Collapsible detail */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: detailHeight,
          transition: 'max-height 0.32s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div ref={detailRef}>
          <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />
          <div style={{ padding: '12px 16px 16px' }}>

            {/* Blinds */}
            {room.blinds && blindStates && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Blinds size={12} strokeWidth={1.75} color="var(--text-muted)" />
                  <span className="pos-eyebrow--muted" style={{ fontSize: 10 }}>Blinds</span>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <BlindSlider
                    label="Left"
                    value={blindStates.left}
                    onChange={v => onBlindChange(room.id, 'left', v)}
                  />
                  <BlindSlider
                    label="Right"
                    value={blindStates.right}
                    onChange={v => onBlindChange(room.id, 'right', v)}
                  />
                </div>
              </div>
            )}

            {/* Light dimmers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {room.lights.map(light => {
                const ls = lightStates[light.id] || { on: false, b: 100 }
                return (
                  <Dimmer
                    key={light.id}
                    light={light}
                    brightness={ls.b}
                    on={ls.on}
                    onToggle={() => handleToggle(light.id)}
                    onBrightnessChange={(b, turnOn) => handleDimmer(light.id, b, turnOn)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
