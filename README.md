# Home Dashboard

A personal smart home dashboard built with React + Vite, connected to [Home Assistant](https://www.home-assistant.io/) via OAuth and WebSocket. Runs as a browser app — designed to sit on a tablet or always-on display.

## Features

- **Room controls** — lights (on/off, dimming) per room with scene presets (Off / Relax / Bright)
- **Blinds control** — living room blind sliders
- **Sensor tiles** — room temperatures, outdoor weather, Octopus Energy daily costs, heating status
- **Weather modal** — current conditions + forecast
- **Person presence** — shows who's home via HA `person` entities
- **Quick actions** — all lights off, good night, movie time
- **Scene customisation** — per-room scene brightness levels, persisted to HA helper

---

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Home Assistant WebSocket API](https://developers.home-assistant.io/docs/api/websocket/) via [`home-assistant-js-websocket`](https://github.com/home-assistant/home-assistant-js-websocket)
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file in the root:

```env
# Set to true to use mock data (no HA connection needed)
VITE_MOCK=true
```

### 3. Run the dev server

```bash
npm run dev
```

### 4. Connect to Home Assistant (real mode)

Set `VITE_MOCK=false` in `.env.local`, then open the app in a browser. You'll be prompted to enter your HA URL (e.g. `http://homeassistant.local:8123`). The app uses OAuth — it will redirect to HA for login, then return to the dashboard.

Your HA URL and auth tokens are saved in `localStorage`, so you only need to do this once per browser/device.

---

## Home Assistant Setup

### Required: Scene settings helper

The dashboard persists custom scene brightness settings to a HA text helper. You must create this manually:

1. Go to **Settings → Devices & Services → Helpers**
2. Click **Add Helper → Text**
3. Name it exactly: `Dashboard Scene Settings`
4. Leave max length at the default (255)
5. The entity ID should be: `input_text.dashboard_scene_settings`

Without this helper, scene customisations will fall back to localStorage only and won't sync across devices.

---

## Entity IDs

All entity IDs are hardcoded in [`src/data/rooms.js`](src/data/rooms.js). Update these to match your HA setup.

### Lights

| Entity ID | Room |
|-----------|------|
| `light.living_room_ceiling` | Living Room |
| `light.living_room_floor_lamp` | Living Room |
| `light.living_room_ball_lamp` | Living Room |
| `light.living_room_light_desk_yellow` | Living Room |
| `light.bedroom_ceiling` | Bedroom |
| `light.bedroom_light_desk_black` | Bedroom |
| `light.kitchen_ceiling` | Kitchen |
| `light.hallway_lights` | Hallway |
| `light.bathroom_lights` | Bathroom |
| `light.landing_ceiling` | Landing |

### Blinds

| Entity ID | Location |
|-----------|----------|
| `cover.living_room_blind_left` | Living Room |
| `cover.living_room_blind_right` | Living Room |

### Sensors

| Entity ID | Purpose |
|-----------|---------|
| `sensor.heating_temperature` | Living room temp |
| `sensor.bedroom_temperature` | Bedroom temp |
| `sensor.house_chopsy_outdoor_temperature` | Outdoor temp |
| `sensor.house_chopsy_weather_condition` | Weather condition string |
| `weather.forecast_home` | Forecast data |
| `sensor.octopus_energy_electricity_*_previous_accumulative_cost` | Daily electricity cost |
| `sensor.octopus_energy_gas_previous_accumulative_cost` | Daily gas cost |
| `binary_sensor.heating_active` | Heating on/off |

> **Note:** The Octopus Energy electricity entity ID contains your MPAN/meter serial — check the exact ID in your HA instance under **Developer Tools → States**.

### Persons

| Entity ID | Who |
|-----------|-----|
| `person.charlie` | Charlie |
| `person.tom` | Tom |

### Helper (required — see setup above)

| Entity ID | Purpose |
|-----------|---------|
| `input_text.dashboard_scene_settings` | Scene brightness persistence |

---

## Project Structure

```
src/
├── components/       # UI components (RoomCard, WeatherModal, SettingsModal, etc.)
├── data/
│   └── rooms.js      # All room config, entity IDs, scenes, sensors, persons
├── ha/
│   ├── HAProvider.jsx  # HA connection context (real + mock)
│   ├── client.js       # WebSocket + OAuth helpers
│   └── mockEntities.js # Mock entity states for development
├── hooks/
│   └── useSceneSettings.js  # Scene persistence (HA helper + localStorage)
└── personal-os/      # Personal OS integrations (calendar, etc.)
```

---

## Mock Mode

With `VITE_MOCK=true`, the app runs entirely on local mock data — no HA connection needed. Useful for development and UI work.

Mock entity states live in [`src/ha/mockEntities.js`](src/ha/mockEntities.js).
