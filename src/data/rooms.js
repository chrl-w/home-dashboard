export const ROOMS = [
  {
    id: 'living',
    name: 'Living Room',
    icon: 'Sofa',
    blinds: { left: { entityId: 'cover.living_room_blind_left', label: 'Left' }, right: { entityId: 'cover.living_room_blind_right', label: 'Right' } },
    lights: [
      { id: 'living_ceiling', name: 'Ceiling',     icon: 'LampCeiling', entityId: 'light.living_room_ceiling' },
      { id: 'living_floor',   name: 'Floor lamp',  icon: 'LampFloor',   entityId: 'light.living_room_floor_lamp' },
      { id: 'living_ball',    name: 'Ball lamp',   icon: 'Lightbulb',   entityId: 'light.living_room_ball_lamp' },
      { id: 'living_desk',    name: 'Desk lamp',   icon: 'LampDesk',    entityId: 'light.living_room_light_desk_yellow' },
      { id: 'living_hanging', name: 'Hanging lamp', icon: 'LampCeiling', entityId: null },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { living_ceiling: { on: false, b: 0 }, living_floor: { on: true, b: 30 }, living_ball: { on: true, b: 30 }, living_desk: { on: true, b: 30 }, living_hanging: { on: false, b: 0 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { living_ceiling: { on: true, b: 100 }, living_floor: { on: true, b: 100 }, living_ball: { on: true, b: 100 }, living_desk: { on: true, b: 100 }, living_hanging: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: 'Bed',
    lights: [
      { id: 'bedroom_ceiling', name: 'Ceiling',   icon: 'LampCeiling', entityId: 'light.bedroom_ceiling' },
      { id: 'bedroom_desk',    name: 'Desk lamp', icon: 'LampDesk',    entityId: 'light.bedroom_light_desk_black' },
      { id: 'bedroom_ambient', name: 'Ambient',   icon: 'Lightbulb',   entityId: null },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { bedroom_ceiling: { on: false, b: 0 }, bedroom_desk: { on: true, b: 20 }, bedroom_ambient: { on: true, b: 30 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { bedroom_ceiling: { on: true, b: 100 }, bedroom_desk: { on: true, b: 100 }, bedroom_ambient: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'UtensilsCrossed',
    lights: [
      { id: 'kitchen_ceiling', name: 'Ceiling',    icon: 'LampCeiling', entityId: 'light.kitchen_ceiling' },
      { id: 'kitchen_under',   name: 'Under unit', icon: 'Lightbulb',   entityId: null },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { kitchen_ceiling: { on: false, b: 0 }, kitchen_under: { on: true, b: 40 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { kitchen_ceiling: { on: true, b: 100 }, kitchen_under: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'hallway',
    name: 'Hallway',
    icon: 'DoorOpen',
    lights: [
      { id: 'hallway_ceiling', name: 'Hallway lights', icon: 'LampCeiling', entityId: 'light.hallway_lights' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { hallway_ceiling: { on: true, b: 10 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { hallway_ceiling: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: 'Bath',
    lights: [
      { id: 'bathroom_lights', name: 'Lights', icon: 'Layers', kind: 'group', count: 4, entityId: 'light.bathroom_lights' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { bathroom_lights: { on: true, b: 30 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { bathroom_lights: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'landing',
    name: 'Landing',
    icon: 'ArrowUpNarrowWide',
    lights: [
      { id: 'landing_ceiling', name: 'Ceiling', icon: 'LampCeiling', entityId: 'light.landing_ceiling' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { landing_ceiling: { on: true, b: 15 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { landing_ceiling: { on: true, b: 100 } } },
    ],
  },
]

export const QUICK_ACTIONS = {
  allOff: { label: 'All lights off', icon: 'Power' },
  goodNight: { label: 'Good night', icon: 'Moon' },
  movieTime: { label: 'Movie time', icon: 'Film' },
}

export const SENSORS = [
  { id: 'inside',   label: 'Inside',   icon: 'Thermometer', unit: '°', entityId: null, mockValue: '21.5' },
  { id: 'outside',  label: 'Outside',  icon: 'Cloud',       unit: '°', entityId: null, mockValue: '13' },
  { id: 'humidity', label: 'Humidity', icon: 'Droplet',     unit: '%', entityId: null, mockValue: '48' },
]
