import { useState } from 'react'
import { AreaProvider } from './personal-os/theme/area-provider'
import { HAProvider, useHA } from './ha/HAProvider.jsx'
import { Header } from './components/Header.jsx'
import { SensorTiles } from './components/SensorTiles.jsx'
import { BottomToolbar } from './components/BottomToolbar.jsx'
import { BlindsModal } from './components/BlindsModal.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { RoomCard } from './components/RoomCard.jsx'
import { ROOMS } from './data/rooms.js'
import { useSceneSettings } from './hooks/useSceneSettings.js'

function initLightStates() {
  const states = {}
  ROOMS.forEach(room => {
    states[room.id] = {}
    room.lights.forEach(l => {
      states[room.id][l.id] = { on: false, b: 100 }
    })
  })
  return states
}

function initBlindStates() {
  const states = {}
  ROOMS.forEach(room => {
    if (room.blinds) {
      states[room.id] = { left: 100, right: 100 }
    }
  })
  return states
}

function Dashboard() {
  const { status, callService } = useHA() || {}
  const [lightStates, setLightStates] = useState(initLightStates)
  const [blindStates, setBlindStates] = useState(initBlindStates)
  const [expanded, setExpanded] = useState(new Set(['living']))
  const [showBlindsModal, setShowBlindsModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { settings, updateLight, resetRoom, effectiveRooms } = useSceneSettings()

  const totalOn = ROOMS.reduce((acc, room) =>
    acc + room.lights.filter(l => lightStates[room.id]?.[l.id]?.on).length, 0)

  function handleLightChange(roomId, lightId, next) {
    setLightStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], [lightId]: next },
    }))
  }

  function handleBlindChange(roomId, side, value) {
    setBlindStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], [side]: value },
    }))
    const room = ROOMS.find(r => r.id === roomId)
    const entityId = room?.blinds?.[side]?.entityId
    if (entityId) callService('cover', 'set_cover_position', { entity_id: entityId, position: value })
  }

  function handleScene(roomId, nextStates) {
    setLightStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], ...nextStates },
    }))
  }

  function toggleExpand(roomId) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(roomId)) next.delete(roomId)
      else next.add(roomId)
      return next
    })
  }

  function handleAllLightsToggle() {
    const anyOn = ROOMS.some(room => room.lights.some(l => lightStates[room.id]?.[l.id]?.on))
    const next = {}
    ROOMS.forEach(room => {
      next[room.id] = { ...lightStates[room.id] }
      room.lights.forEach(l => {
        const newOn = !anyOn
        next[room.id][l.id] = { ...lightStates[room.id]?.[l.id], on: newOn }
        if (l.entityId && callService) {
          callService('light', newOn ? 'turn_on' : 'turn_off', { entity_id: l.entityId })
        }
      })
    })
    setLightStates(next)
  }

  function handleBlindsToggle() {
    const anyOpen = ROOMS.some(room =>
      room.blinds && (blindStates[room.id]?.left > 0 || blindStates[room.id]?.right > 0)
    )
    const targetPos = anyOpen ? 0 : 100
    const next = { ...blindStates }
    ROOMS.forEach(room => {
      if (!room.blinds) return
      next[room.id] = { left: targetPos, right: targetPos }
      if (room.blinds.left?.entityId && callService) {
        callService('cover', 'set_cover_position', { entity_id: room.blinds.left.entityId, position: targetPos })
      }
      if (room.blinds.right?.entityId && callService) {
        callService('cover', 'set_cover_position', { entity_id: room.blinds.right.entityId, position: targetPos })
      }
    })
    setBlindStates(next)
  }

  function handleGoodnight() {
    // All off
    const next = {}
    ROOMS.forEach(room => {
      next[room.id] = { ...lightStates[room.id] }
      room.lights.forEach(l => {
        next[room.id][l.id] = { ...lightStates[room.id]?.[l.id], on: false }
        if (l.entityId && callService) callService('light', 'turn_off', { entity_id: l.entityId })
      })
    })
    // Bedroom desk → 12%, hallway → 8%
    const bedroomDesk = ROOMS.find(r => r.id === 'bedroom')?.lights.find(l => l.id === 'bedroom_desk')
    const hallway = ROOMS.find(r => r.id === 'hallway')?.lights.find(l => l.id === 'hallway_ceiling')
    if (next.bedroom) next.bedroom.bedroom_desk = { on: true, b: 12 }
    if (next.hallway) next.hallway.hallway_ceiling = { on: true, b: 8 }
    if (bedroomDesk?.entityId && callService) callService('light', 'turn_on', { entity_id: bedroomDesk.entityId, brightness_pct: 12 })
    if (hallway?.entityId && callService) callService('light', 'turn_on', { entity_id: hallway.entityId, brightness_pct: 8 })
    setLightStates(next)
  }

  return (
    <div style={{
      background: 'var(--background)',
      minHeight: '100dvh',
      paddingBottom: 120,
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {status === 'error' && (
        <div style={{
          background: 'color-mix(in srgb, #E85070 15%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, #E85070 30%, transparent)',
          padding: '8px 20px',
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: '#E85070',
          textAlign: 'center',
        }}>
          Home Assistant disconnected
        </div>
      )}

      <Header lightsOnCount={totalOn} />
      <SensorTiles />

      {/* Rooms section */}
      <div>
        <p className="pos-eyebrow--muted" style={{ padding: '14px 22px 10px' }}>Rooms</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, padding: '0 20px 32px' }}>
          {effectiveRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              lightStates={lightStates[room.id] || {}}
              blindStates={blindStates[room.id] || null}
              expanded={expanded.has(room.id)}
              onToggleExpand={() => toggleExpand(room.id)}
              onLightChange={handleLightChange}
              onBlindChange={handleBlindChange}
              onScene={handleScene}
            />
          ))}
        </div>
      </div>

      <BottomToolbar
        lightStates={lightStates}
        blindStates={blindStates}
        onAllLightsToggle={handleAllLightsToggle}
        onBlindsToggle={() => setShowBlindsModal(true)}
        onGoodnight={handleGoodnight}
        onSettings={() => setShowSettings(true)}
      />

      {showBlindsModal && (
        <BlindsModal
          blindStates={blindStates}
          onBlindChange={handleBlindChange}
          onClose={() => setShowBlindsModal(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateLight={updateLight}
          onResetRoom={resetRoom}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AreaProvider area="home">
      <HAProvider>
        <Dashboard />
      </HAProvider>
    </AreaProvider>
  )
}
