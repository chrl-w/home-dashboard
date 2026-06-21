import { useState, useCallback } from 'react'
import { ROOMS } from '../data/rooms.js'

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

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return buildDefaults()
    const parsed = JSON.parse(stored)
    const defaults = buildDefaults()
    // Deep merge: stored values win, but new lights/rooms from defaults fill in gaps
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
  } catch {
    return buildDefaults()
  }
}

export function useSceneSettings() {
  const [settings, setSettings] = useState(loadSettings)

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetRoom = useCallback(roomId => {
    const defaults = buildDefaults()
    setSettings(prev => {
      const next = { ...prev, [roomId]: defaults[roomId] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  // Returns ROOMS with scene states replaced by editable overrides
  const effectiveRooms = ROOMS.map(room => ({
    ...room,
    scenes: room.scenes.map(scene => {
      if (!EDITABLE_SCENES.includes(scene.id)) return scene
      return { ...scene, states: settings[room.id]?.[scene.id] ?? scene.states }
    }),
  }))

  return { settings, updateLight, resetRoom, effectiveRooms }
}
