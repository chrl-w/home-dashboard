export const ROOMS = [
  {
    id: 'living',
    name: 'Living Room',
    icon: 'Sofa',
    blinds: { left: { entityId: 'cover.living_room_blind_left', label: 'Left' }, right: { entityId: 'cover.living_room_blind_right', label: 'Right' } },
    lights: [
      { id: 'living_ceiling', name: 'Overhead',     icon: 'LampCeiling', entityId: 'light.living_room_ceiling' },
      { id: 'living_floor',   name: 'Floor lamp',  icon: 'LampFloor',   entityId: 'light.living_room_floor_lamp' },
      { id: 'living_ball',    name: 'Ball lamp',   icon: 'Lightbulb',   entityId: 'light.living_room_ball_lamp' },
      { id: 'living_desk',    name: 'Desk lamp',   icon: 'LampDesk',    entityId: 'light.living_room_light_desk_yellow' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { living_ceiling: { on: false, b: 0 }, living_floor: { on: true, b: 30 }, living_ball: { on: true, b: 30 }, living_desk: { on: true, b: 30 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { living_ceiling: { on: true, b: 100 }, living_floor: { on: true, b: 100 }, living_ball: { on: true, b: 100 }, living_desk: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: 'Bed',
    lights: [
      { id: 'bedroom_ceiling', name: 'Overhead',   icon: 'LampCeiling', entityId: 'light.bedroom_ceiling' },
      { id: 'bedroom_desk',    name: 'Desk lamp', icon: 'LampDesk',    entityId: 'light.bedroom_light_desk_black' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { bedroom_ceiling: { on: false, b: 0 }, bedroom_desk: { on: true, b: 20 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { bedroom_ceiling: { on: true, b: 100 }, bedroom_desk: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'UtensilsCrossed',
    lights: [
      { id: 'kitchen_ceiling', name: 'Overhead',    icon: 'LampCeiling', entityId: 'light.kitchen_ceiling' },
    ],
    scenes: [
      { id: 'off',    name: 'Off',    icon: 'Power',     states: {} },
      { id: 'relax',  name: 'Relax',  icon: 'Moon',      states: { kitchen_ceiling: { on: true, b: 40 } } },
      { id: 'bright', name: 'Bright', icon: 'Lightbulb', states: { kitchen_ceiling: { on: true, b: 100 } } },
    ],
  },
  {
    id: 'hallway',
    name: 'Hallway',
    icon: 'DoorOpen',
    lights: [
      { id: 'hallway_ceiling', name: 'Overhead', icon: 'LampCeiling', entityId: 'light.hallway_lights' },
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
      { id: 'landing_ceiling', name: 'Overhead', icon: 'LampCeiling', entityId: 'light.landing_ceiling' },
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
  { id: 'living',  roomIcon: 'Sofa', unit: '°', entityId: 'sensor.heating_temperature',               mockValue: '21.5' },
  { id: 'bedroom', roomIcon: 'Bed',  unit: '°', entityId: 'sensor.bedroom_temperature',                mockValue: '19.5' },
  { id: 'outside', roomIcon: null,   unit: '°', entityId: 'sensor.house_chopsy_outdoor_temperature',   weatherEntityId: 'sensor.house_chopsy_weather_condition', mockValue: '14.2' },
]

export const PERSONS = [
  { id: 'person.charlie', initials: 'C' },
  { id: 'person.tom',     initials: 'T' },
]
