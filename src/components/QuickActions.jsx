import { Power, Moon, Film } from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { ROOMS } from '../data/rooms.js'

export function QuickActions({ roomStates, onRoomStatesChange }) {
  const { callService } = useHA() || {}

  function allLightsOff() {
    const next = {}
    ROOMS.forEach(room => {
      next[room.id] = { ...roomStates[room.id] }
      room.lights.forEach(l => {
        next[room.id][l.id] = { on: false, b: next[room.id]?.[l.id]?.b ?? 0 }
        if (l.entityId && callService) {
          callService('light', 'turn_off', { entity_id: l.entityId })
        }
      })
    })
    onRoomStatesChange(next)
  }

  function goodNight() {
    allLightsOff()
    setTimeout(() => {
      const next = structuredClone(roomStates)
      // Bedroom desk lamp → 12%
      if (next.bedroom) next.bedroom.bedroom_desk = { on: true, b: 12 }
      // Hallway → 8%
      if (next.hallway) next.hallway.hallway_ceiling = { on: true, b: 8 }
      onRoomStatesChange(next)
      const bedroomDesk = ROOMS.find(r => r.id === 'bedroom')?.lights.find(l => l.id === 'bedroom_desk')
      const hallwayCeiling = ROOMS.find(r => r.id === 'hallway')?.lights.find(l => l.id === 'hallway_ceiling')
      if (bedroomDesk?.entityId && callService) callService('light', 'turn_on', { entity_id: bedroomDesk.entityId, brightness_pct: 12 })
      if (hallwayCeiling?.entityId && callService) callService('light', 'turn_on', { entity_id: hallwayCeiling.entityId, brightness_pct: 8 })
    }, 100)
  }

  function movieTime() {
    allLightsOff()
    setTimeout(() => {
      const next = structuredClone(roomStates)
      if (next.living) {
        next.living.living_floor = { on: true, b: 15 }
        next.living.living_sofa = { on: true, b: 8 }
      }
      onRoomStatesChange(next)
      const floor = ROOMS.find(r => r.id === 'living')?.lights.find(l => l.id === 'living_floor')
      const sofa = ROOMS.find(r => r.id === 'living')?.lights.find(l => l.id === 'living_sofa')
      if (floor?.entityId && callService) callService('light', 'turn_on', { entity_id: floor.entityId, brightness_pct: 15 })
      if (sofa?.entityId && callService) callService('light', 'turn_on', { entity_id: sofa.entityId, brightness_pct: 8 })
    }, 100)
  }

  return (
    <div className="pos-scroll-row" style={{ padding: '16px 20px 6px', gap: 9 }}>
      <button className="pos-quick-btn pos-quick-btn--secondary" onClick={allLightsOff}>
        <Power size={17} strokeWidth={1.75} />
        All lights off
      </button>
      <button className="pos-quick-btn pos-quick-btn--primary" onClick={goodNight}>
        <Moon size={17} strokeWidth={1.75} />
        Good night
      </button>
      <button className="pos-quick-btn pos-quick-btn--secondary" onClick={movieTime}>
        <Film size={17} strokeWidth={1.75} />
        Movie time
      </button>
    </div>
  )
}
