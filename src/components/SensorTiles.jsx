import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudRainWind, CloudSnow, CloudFog, CloudLightning, CloudHail, Wind } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { SENSORS, PERSONS } from '../data/rooms.js'

const WEATHER_ICONS = {
  'sunny':               { Icon: Sun,            color: '#F0A030' },
  'clear-night':         { Icon: Moon,           color: '#9878b8' },
  'partlycloudy':        { Icon: CloudSun,       color: '#F0A030' },
  'partly-cloudy-day':   { Icon: CloudSun,       color: '#F0A030' },
  'partly-cloudy-night': { Icon: CloudMoon,      color: '#9878b8' },
  'cloudy':              { Icon: Cloud,          color: 'var(--text-muted)' },
  'fog':                 { Icon: CloudFog,       color: 'var(--text-muted)' },
  'rainy':               { Icon: CloudRain,      color: '#6ba3d6' },
  'pouring':             { Icon: CloudRainWind,  color: '#6ba3d6' },
  'snowy':               { Icon: CloudSnow,      color: '#b0cde8' },
  'snowy-rainy':         { Icon: CloudRainWind,  color: '#b0cde8' },
  'windy':               { Icon: Wind,           color: 'var(--text-muted)' },
  'windy-variant':       { Icon: Wind,           color: 'var(--text-muted)' },
  'lightning':           { Icon: CloudLightning, color: '#F0A030' },
  'lightning-rainy':     { Icon: CloudLightning, color: '#6ba3d6' },
  'hail':                { Icon: CloudHail,      color: '#b0cde8' },
  'exceptional':         { Icon: Cloud,          color: 'var(--text-muted)' },
}

export function SensorTiles({ onWeatherOpen }) {
  const { entities } = useHA() || { entities: {} }

  const persons = PERSONS.map(p => {
    const entity = entities?.[p.id]
    const isHome = entity?.state === 'home'
    const name = entity?.attributes?.friendly_name || p.initials
    const initial = name.charAt(0).toUpperCase()
    return { ...p, isHome, initial, name }
  })

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '14px 20px 4px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>

      {/* Person avatar stack */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {persons.map((p, i) => (
          <div
            key={p.id}
            title={`${p.name} — ${p.isHome ? 'home' : 'away'}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              background: p.isHome ? 'var(--primary)' : 'var(--surface-secondary)',
              border: '2px solid var(--background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: p.isHome ? '#fff' : 'var(--text-muted)',
              marginLeft: i === 0 ? 0 : -8,
              zIndex: persons.length - i,
              position: 'relative',
            }}
          >
            {p.initial}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        width: 1,
        height: 28,
        background: 'var(--border)',
        alignSelf: 'center',
        flexShrink: 0,
      }} />

      {/* Sensor chips */}
      {SENSORS.map(s => {
        const entity = s.entityId ? entities[s.entityId] : null
        const rawValue = entity?.state
        const value = rawValue && rawValue !== 'unavailable' && rawValue !== 'unknown'
          ? parseFloat(rawValue).toFixed(1).replace(/\.0$/, '')
          : s.mockValue

        let IconComponent, iconColor

        if (s.id === 'outside' && s.weatherEntityId) {
          const condition = entities[s.weatherEntityId]?.state?.toLowerCase() || ''
          const weather = WEATHER_ICONS[condition] || { Icon: Cloud, color: 'var(--text-muted)' }
          IconComponent = weather.Icon
          iconColor = weather.color
        } else {
          IconComponent = Icons[s.roomIcon] || Icons.Thermometer
          iconColor = 'var(--text-muted)'
        }

        const isWeather = s.id === 'outside'
        return (
          <div
            key={s.id}
            onClick={isWeather ? onWeatherOpen : undefined}
            style={{
              ...chipStyle,
              ...(isWeather ? { cursor: 'pointer', border: '1px solid var(--primary)', background: 'color-mix(in srgb, var(--primary) 16%, transparent)' } : {}),
            }}
          >
            <IconComponent size={14} strokeWidth={2} color={iconColor} />
            <span style={valueStyle}>{value}{s.unit}</span>
          </div>
        )
      })}
    </div>
  )
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 9999,
  background: 'var(--surface-card)',
  border: '1px solid var(--border)',
  flex: 'none',
}

const valueStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-body)',
}
