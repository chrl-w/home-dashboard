import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudRainWind, CloudSnow, CloudFog, CloudLightning, CloudHail, Wind, Thermometer, Droplet } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { SENSORS } from '../data/rooms.js'

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

export function SensorTiles() {
  const { entities } = useHA() || { entities: {} }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 20px 4px' }}>
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
          IconComponent = Icons[s.icon] || Thermometer
          iconColor = s.id === 'inside' ? 'var(--primary-grad-to)' : 'var(--text-muted)'
        }

        return (
          <div key={s.id} style={chipStyle}>
            <IconComponent size={14} strokeWidth={2} color={iconColor} />
            <span style={labelStyle}>{s.label}</span>
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
}

const labelStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-muted)',
}

const valueStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-body)',
}
