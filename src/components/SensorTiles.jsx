import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudRainWind, CloudSnow, CloudFog, CloudLightning, CloudHail, Wind, Thermometer, Droplet, Snowflake } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { SENSORS } from '../data/rooms.js'

const WEATHER_ICONS = {
  'sunny':            { Icon: Sun,            color: '#F0A030' },
  'clear-night':      { Icon: Moon,           color: '#9878b8' },
  'partlycloudy':     { Icon: CloudSun,       color: '#F0A030' },
  'partly-cloudy-day':{ Icon: CloudSun,       color: '#F0A030' },
  'partly-cloudy-night':{ Icon: CloudMoon,    color: '#9878b8' },
  'cloudy':           { Icon: Cloud,          color: 'var(--text-muted)' },
  'fog':              { Icon: CloudFog,       color: 'var(--text-muted)' },
  'rainy':            { Icon: CloudRain,      color: '#6ba3d6' },
  'pouring':          { Icon: CloudRainWind,  color: '#6ba3d6' },
  'snowy':            { Icon: CloudSnow,      color: '#b0cde8' },
  'snowy-rainy':      { Icon: CloudRainWind,  color: '#b0cde8' },
  'windy':            { Icon: Wind,           color: 'var(--text-muted)' },
  'windy-variant':    { Icon: Wind,           color: 'var(--text-muted)' },
  'lightning':        { Icon: CloudLightning, color: '#F0A030' },
  'lightning-rainy':  { Icon: CloudLightning, color: '#6ba3d6' },
  'hail':             { Icon: CloudHail,      color: '#b0cde8' },
  'exceptional':      { Icon: Cloud,          color: 'var(--text-muted)' },
}

export function SensorTiles() {
  const { entities } = useHA() || { entities: {} }

  return (
    <div className="pos-scroll-row" style={{ padding: '14px 20px 2px' }}>
      {SENSORS.map(s => {
        const entity = s.entityId ? entities[s.entityId] : null
        const rawValue = entity?.state
        const value = rawValue && rawValue !== 'unavailable' && rawValue !== 'unknown'
          ? parseFloat(rawValue).toFixed(1).replace(/\.0$/, '')
          : s.mockValue
        const isInside = s.id === 'inside'

        // Outside tile: show weather icon based on condition entity
        if (s.id === 'outside' && s.weatherEntityId) {
          const condition = entities[s.weatherEntityId]?.state?.toLowerCase() || ''
          const weather = WEATHER_ICONS[condition] || { Icon: Cloud, color: 'var(--text-muted)' }
          return (
            <div key={s.id} className="pos-card--slim" style={{ width: 150, flex: 'none' }}>
              <weather.Icon size={24} strokeWidth={1.75} color={weather.color} style={{ marginBottom: 6 }} />
              <div style={labelStyle}>{s.label}</div>
              <div style={valueStyle}>{value}°</div>
            </div>
          )
        }

        const Icon = Icons[s.icon] || Thermometer
        return (
          <div key={s.id} className="pos-card--slim" style={{ width: 150, flex: 'none' }}>
            <Icon
              size={24}
              strokeWidth={1.75}
              color={isInside ? 'var(--primary-grad-to)' : 'var(--text-muted)'}
              style={{ marginBottom: 6 }}
            />
            <div style={labelStyle}>{s.label}</div>
            <div style={valueStyle}>{value}{s.unit}</div>
          </div>
        )
      })}
    </div>
  )
}

const labelStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  marginBottom: 2,
}

const valueStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 17,
  fontWeight: 600,
  color: 'var(--text-body)',
}
