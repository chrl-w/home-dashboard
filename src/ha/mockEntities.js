export const MOCK_ENTITIES = {
  // Lights — living room
  'light.living_room_ceiling':          { state: 'on',          attributes: { brightness: 255, friendly_name: 'Living room ceiling' } },
  'light.living_room_floor_lamp':       { state: 'on',          attributes: { brightness: 77,  friendly_name: 'Living room floor lamp' } },
  'light.living_room_ball_lamp':        { state: 'unavailable', attributes: { brightness: 77,  friendly_name: 'Living room ball lamp' } },
  'light.living_room_light_desk_yellow':{ state: 'on',          attributes: { brightness: 77,  friendly_name: 'Living room desk lamp' } },

  // Lights — bedroom
  'light.bedroom_ceiling':              { state: 'off', attributes: { brightness: 255, friendly_name: 'Bedroom ceiling' } },
  'light.bedroom_light_desk_black':     { state: 'on',  attributes: { brightness: 51,  friendly_name: 'Bedroom desk lamp' } },

  // Lights — other rooms
  'light.kitchen_ceiling':              { state: 'off', attributes: { brightness: 255, friendly_name: 'Kitchen ceiling' } },
  'light.hallway_lights':               { state: 'off', attributes: { brightness: 255, friendly_name: 'Hallway lights' } },
  'light.bathroom_lights':              { state: 'off', attributes: { brightness: 255, friendly_name: 'Bathroom lights' } },
  'light.landing_ceiling':              { state: 'off', attributes: { brightness: 255, friendly_name: 'Landing ceiling' } },

  // Blinds
  'cover.living_room_blind_left':       { state: 'open', attributes: { current_position: 100, friendly_name: 'Living room blind left' } },
  'cover.living_room_blind_right':      { state: 'open', attributes: { current_position: 100, friendly_name: 'Living room blind right' } },

  // Sensors
  'sensor.heating_temperature':                  { state: '21.5', attributes: { unit_of_measurement: '°C', friendly_name: 'Heating temperature' } },
  'sensor.bedroom_temperature':                  { state: '19.5', attributes: { unit_of_measurement: '°C', friendly_name: 'Bedroom temperature' } },
  'sensor.house_chopsy_outdoor_temperature':     { state: '14.2', attributes: { unit_of_measurement: '°C', friendly_name: 'Outside temperature' } },
  'sensor.house_chopsy_weather_condition':       { state: 'partlycloudy', attributes: { friendly_name: 'Weather condition' } },

  // Energy sensors
  'sensor.octopus_energy_electricity_23j0105199_1200020622277_previous_accumulative_cost': { state: '2.34', attributes: { unit_of_measurement: '£', friendly_name: 'Electricity yesterday' } },
  'sensor.octopus_energy_gas_previous_accumulative_cost': { state: '1.85', attributes: { unit_of_measurement: '£', friendly_name: 'Gas yesterday' } },

  // Heating
  'binary_sensor.heating_active':       { state: 'on', attributes: { friendly_name: 'Heating active' } },

  // Blind reason
  'input_select.living_room_blinds_reason': { state: 'Sunset', attributes: { friendly_name: 'Living room blinds reason' } },

  // Persons — both home for testing
  'person.charlie': { state: 'home', attributes: { friendly_name: 'Charlie' } },
  'person.tom':     { state: 'home', attributes: { friendly_name: 'Tom' } },
}

export const MOCK_USER = { name: 'Charlie Watkinson' }
