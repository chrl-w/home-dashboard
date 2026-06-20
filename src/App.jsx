import { useState } from 'react'
import { AreaProvider } from './personal-os/theme/area-provider'
import { HAProvider, useHA } from './ha/HAProvider.jsx'
import { StatusBar } from './components/StatusBar.jsx'
import { Header } from './components/Header.jsx'
import { SensorTiles } from './components/SensorTiles.jsx'
import { QuickActions } from './components/QuickActions.jsx'
import { RoomCard } from './components/RoomCard.jsx'
import { ROOMS } from './data/rooms.js'

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

  function handleRoomStatesChange(next) {
    setLightStates(next)
  }

  function toggleExpand(roomId) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(roomId)) next.delete(roomId)
      else next.add(roomId)
      return next
    })
  }

  return (
    <div style={{
      background: 'var(--background)',
      minHeight: '100dvh',
      paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {/* Connection indicator */}
      {status === 'error' && (
        <div style={{
          background: 'color-mix(in srgb, var(--pos-danger) 15%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--pos-danger) 30%, transparent)',
          padding: '8px 20px',
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--pos-danger)',
          textAlign: 'center',
        }}>
          Home Assistant disconnected
        </div>
      )}

      <Header lightsOnCount={totalOn} />
      <SensorTiles />
      <QuickActions roomStates={lightStates} onRoomStatesChange={handleRoomStatesChange} />

      {/* Rooms section */}
      <div>
        <p className="pos-eyebrow--muted" style={{ padding: '14px 22px 10px' }}>Rooms</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, padding: '0 20px 32px' }}>
          {ROOMS.map(room => (
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
