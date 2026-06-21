import { useState, useCallback, useEffect, useRef } from 'react'
import { ROOMS } from '../data/rooms.js'

// Create this helper via HA UI: Settings → Devices & Services → Helpers → Add Helper → Text
// Name: "Dashboard Scene Settings", max length: 255 (default)
// Entity ID will be: input_text.dashboard_scene_settings
const HA_ENTITY = 'input_text.dashboard_scene_settings'

const STORAGE_KEY = 'scene-settings'
const EDITABLE_SCENES = ['relax', 'bright']

function buildDefaults() {
  const defaults = {}
  ROOMS.forEach(room => {
    defaults[room.id] = {}
    room.scenes
      .filter(s => EDITABLE_SCENES.includes(s.id))
      .forEach(scene => {
        defaults[room.id][scene.id] = { ...scene.states }
      })
  })
  return defaults
}

function mergeWithDefaults(parsed) {
  const defaults = buildDefaults()
  const merged = {}
  Object.keys(defaults).forEach(roomId => {
    merged[roomId] = {}
    Object.keys(defaults[roomId]).forEach(sceneId => {
      merged[roomId][sceneId] = {
        ...defaults[roomId][sceneId],
        ...(parsed[roomId]?.[sceneId] ?? {}),
      }
    })
  })
  return merged
}

function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return buildDefaults()
    const parsed = JSON.parse(stored)
    // Support both old verbose format and new compact format
    const isCompact = parsed && typeof Object.values(parsed)[0]?.r !== 'undefined'
    return isCompact ? mergeWithDefaults(decodeCompact(stored)) : mergeWithDefaults(parsed)
  } catch {
    return buildDefaults()
  }
}

// Compact format: { roomId: { r: [b0,b1,...], b: [b0,b1,...] } }
// 0 = off, positive number = on at that brightness. Fits in 255 chars.
function encode(settings) {
  const compact = {}
  ROOMS.forEach(room => {
    compact[room.id] = {
      r: room.lights.map(l => { const s = settings[room.id]?.relax?.[l.id]; return s?.on ? s.b : 0 }),
      b: room.lights.map(l => { const s = settings[room.id]?.bright?.[l.id]; return s?.on ? s.b : 0 }),
    }
  })
  return JSON.stringify(compact)
}

function decodeCompact(json) {
  const compact = JSON.parse(json)
  const settings = {}
  ROOMS.forEach(room => {
    settings[room.id] = { relax: {}, bright: {} }
    const d = compact[room.id]
    if (!d) return
    room.lights.forEach((l, i) => {
      const rb = d.r?.[i] ?? 0
      const bb = d.b?.[i] ?? 0
      settings[room.id].relax[l.id] = rb > 0 ? { on: true, b: rb } : { on: false, b: 0 }
      settings[room.id].bright[l.id] = bb > 0 ? { on: true, b: bb } : { on: false, b: 0 }
    })
  })
  return settings
}

function persist(callService, next) {
  const json = encode(next)
  localStorage.setItem(STORAGE_KEY, json)
  callService('input_text', 'set_value', { entity_id: HA_ENTITY, value: json })
}

export function useSceneSettings({ entities, callService }) {
  const [settings, setSettings] = useState(loadFromLocalStorage)
  const hasSyncedFromHA = useRef(false)

  // One-time sync from HA entity on first load — HA is source of truth if it has data
  useEffect(() => {
    if (hasSyncedFromHA.current) return
    const entityState = entities?.[HA_ENTITY]?.state
    if (!entityState || entityState === 'unknown') return
    try {
      setSettings(mergeWithDefaults(decodeCompact(entityState)))
      hasSyncedFromHA.current = true
    } catch {}
  }, [entities])

  const updateLight = useCallback((roomId, sceneId, lightId, patch) => {
    setSettings(prev => {
      const next = {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [sceneId]: {
            ...prev[roomId]?.[sceneId],
            [lightId]: { ...prev[roomId]?.[sceneId]?.[lightId], ...patch },
          },
        },
      }
      persist(callService, next)
      return next
    })
  }, [callService])

  const resetRoom = useCallback(roomId => {
    const defaults = buildDefaults()
    setSettings(prev => {
      const next = { ...prev, [roomId]: defaults[roomId] }
      persist(callService, next)
      return next
    })
  }, [callService])

  const effectiveRooms = ROOMS.map(room => ({
    ...room,
    scenes: room.scenes.map(scene => {
      if (!EDITABLE_SCENES.includes(scene.id)) return scene
      return { ...scene, states: settings[room.id]?.[scene.id] ?? scene.states }
    }),
  }))

  return { settings, updateLight, resetRoom, effectiveRooms }
}
