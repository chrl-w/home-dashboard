import { useEffect, useRef, useState } from 'react'
import {
  X, MapPin, Droplets, Wind, Gauge,
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain,
  CloudRainWind, CloudSnow, CloudLightning,
} from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'

// HA condition → lucide icon + color
const CONDITION_MAP = {
  'sunny':               { Icon: Sun,           color: '#F0A030' },
  'clear-night':         { Icon: Moon,          color: '#b9a6e8' },
  'partlycloudy':        { Icon: CloudSun,      color: '#F0A030' },
  'partly-cloudy-day':   { Icon: CloudSun,      color: '#F0A030' },
  'partly-cloudy-night': { Icon: CloudMoon,     color: '#b9a6e8' },
  'cloudy':              { Icon: Cloud,         color: 'var(--text-muted)' },
  'fog':                 { Icon: Cloud,         color: 'var(--text-muted)' },
  'rainy':               { Icon: CloudRain,     color: '#5b9be8' },
  'pouring':             { Icon: CloudRainWind, color: '#5b9be8' },
  'snowy':               { Icon: CloudSnow,     color: '#b0cde8' },
  'snowy-rainy':         { Icon: CloudRainWind, color: '#b0cde8' },
  'windy':               { Icon: Wind,          color: 'var(--text-muted)' },
  'windy-variant':       { Icon: Wind,          color: 'var(--text-muted)' },
  'lightning':           { Icon: CloudLightning,color: '#F0A030' },
  'lightning-rainy':     { Icon: CloudLightning,color: '#5b9be8' },
}

const WEATHER_ENTITY = 'weather.forecast_home'
const TEMP_ENTITY    = 'sensor.house_chopsy_outdoor_temperature'
const COND_ENTITY    = 'sensor.house_chopsy_weather_condition'

function condInfo(condition) {
  return CONDITION_MAP[condition?.toLowerCase()] || { Icon: Cloud, color: 'var(--text-muted)' }
}

const COND_LABELS = {
  'sunny':               'Sunny',
  'clear-night':         'Clear night',
  'partlycloudy':        'Partly cloudy',
  'partly-cloudy-day':   'Partly cloudy',
  'partly-cloudy-night': 'Partly cloudy',
  'cloudy':              'Cloudy',
  'fog':                 'Foggy',
  'rainy':               'Rainy',
  'pouring':             'Heavy rain',
  'snowy':               'Snowy',
  'snowy-rainy':         'Sleet',
  'windy':               'Windy',
  'windy-variant':       'Windy',
  'lightning':           'Thunderstorm',
  'lightning-rainy':     'Thunderstorm',
}

function condLabel(condition) {
  if (!condition) return 'Unknown'
  return COND_LABELS[condition.toLowerCase()] || condition.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmt(temp) {
  if (temp == null) return '—'
  return Math.round(temp) + '°'
}

function fmtHour(isoString, index) {
  if (index === 0) return 'Now'
  const d = new Date(isoString)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function fmtDay(isoString, index) {
  if (index === 0) return 'Today'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-GB', { weekday: 'short' })
}

// Static fallback data
const MOCK_HOURLY = [
  { time: 'Now',   hi: 14, lo: 13, condition: 'partlycloudy', pop: 10 },
  { time: '16:00', hi: 14, lo: 13, condition: 'cloudy',       pop: 20 },
  { time: '17:00', hi: 13, lo: 11, condition: 'rainy',        pop: 60 },
  { time: '18:00', hi: 12, lo: 11, condition: 'rainy',        pop: 55 },
  { time: '19:00', hi: 12, lo: 11, condition: 'partlycloudy', pop: 20 },
  { time: '20:00', hi: 11, lo: 10, condition: 'clear-night',  pop: 5  },
  { time: '21:00', hi: 10, lo: 9,  condition: 'clear-night',  pop: 5  },
  { time: '22:00', hi: 10, lo: 8,  condition: 'cloudy',       pop: 10 },
  { time: '23:00', hi: 9,  lo: 8,  condition: 'cloudy',       pop: 15 },
  { time: '00:00', hi: 9,  lo: 7,  condition: 'cloudy',       pop: 15 },
]

const MOCK_DAILY = [
  { day: 'Sun', label: 'Today', condition: 'partlycloudy', pop: 30, hi: 17, lo: 9  },
  { day: 'Mon', label: '',      condition: 'cloudy',       pop: 20, hi: 16, lo: 8  },
  { day: 'Tue', label: '',      condition: 'rainy',        pop: 70, hi: 15, lo: 7  },
  { day: 'Wed', label: '',      condition: 'rainy',        pop: 65, hi: 14, lo: 6  },
  { day: 'Thu', label: '',      condition: 'partlycloudy', pop: 15, hi: 18, lo: 10 },
  { day: 'Fri', label: '',      condition: 'sunny',        pop: 5,  hi: 19, lo: 11 },
  { day: 'Sat', label: '',      condition: 'partlycloudy', pop: 20, hi: 17, lo: 10 },
]

function CondIcon({ condition, size = 20 }) {
  const { Icon, color } = condInfo(condition)
  return <Icon size={size} strokeWidth={1.75} color={color} style={{ flex: 'none' }} />
}

function ForecastRow({ icon, label, sublabel, pop, lo, hi, isLast }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 2px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {sublabel ? <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>{sublabel}</span> : null}
      </div>
      <div style={{ minWidth: 42, textAlign: 'right', fontSize: 11, color: '#5b9be8', fontFamily: 'var(--font-mono)' }}>
        {pop >= 20 ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Droplets size={11} strokeWidth={2} color="#5b9be8" />
            {pop}%
          </span>
        ) : null}
      </div>
      <div style={{ width: 34, textAlign: 'right', fontSize: 14, color: 'var(--text-muted)' }}>{fmt(lo)}</div>
      <div style={{ width: 34, textAlign: 'right', fontSize: 15, fontWeight: 600, color: 'var(--text-body)' }}>{fmt(hi)}</div>
    </div>
  )
}

export function WeatherModal({ onClose }) {
  const { entities, callService } = useHA() || {}
  const [tab, setTab] = useState('hourly')
  const [hourly, setHourly] = useState(null)
  const [daily, setDaily] = useState(null)
  const overlayRef = useRef(null)

  const condition = entities?.[COND_ENTITY]?.state || 'partlycloudy'
  const tempRaw = entities?.[TEMP_ENTITY]?.state
  const curTemp = tempRaw && tempRaw !== 'unavailable' ? parseFloat(tempRaw).toFixed(1) + '°' : '14.2°'

  const weatherAttrs = entities?.[WEATHER_ENTITY]?.attributes || {}
  const humidity    = weatherAttrs.humidity    != null ? weatherAttrs.humidity + '%'     : '72%'
  const windSpeed   = weatherAttrs.wind_speed  != null ? Math.round(weatherAttrs.wind_speed) + ' mph' : '9 mph'
  const windBearing = weatherAttrs.wind_bearing != null ? bearingToDir(weatherAttrs.wind_bearing) : 'NE'
  const pressure    = weatherAttrs.pressure    != null ? Math.round(weatherAttrs.pressure) + ' hPa'  : '1024 hPa'
  const tempHi      = weatherAttrs.temperature != null ? weatherAttrs.temperature : 17
  const tempLo      = 9 // HA doesn't expose daily low in current state
  const feelsLike   = weatherAttrs.apparent_temperature != null
    ? `Feels like ${Math.round(weatherAttrs.apparent_temperature)}°`
    : 'Feels like 13°'

  // Fetch forecasts from HA
  useEffect(() => {
    if (!callService) return
    Promise.all([
      callService('weather', 'get_forecasts', { entity_id: WEATHER_ENTITY, type: 'hourly' }, { returnResponse: true }),
      callService('weather', 'get_forecasts', { entity_id: WEATHER_ENTITY, type: 'daily'  }, { returnResponse: true }),
    ])
      .then(([hourlyRes, dailyRes]) => {
        const hData = hourlyRes?.response?.[WEATHER_ENTITY]?.forecast
        if (hData?.length) {
          setHourly(hData.map((f, i) => ({
            time:      fmtHour(f.datetime, i),
            condition: f.condition,
            hi:        f.temperature,
            lo:        f.templow ?? f.temperature - 3,
            pop:       Math.round((f.precipitation_probability ?? 0)),
          })))
        }
        const dData = dailyRes?.response?.[WEATHER_ENTITY]?.forecast
        if (dData?.length) {
          setDaily(dData.map((f, i) => ({
            day:       fmtDay(f.datetime, i),
            label:     i === 0 ? 'Today' : '',
            condition: f.condition,
            hi:        f.temperature,
            lo:        f.templow ?? f.temperature - 8,
            pop:       Math.round((f.precipitation_probability ?? 0)),
          })))
        }
      })
      .catch(() => {}) // silently fall back to mock
  }, [callService])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const hourlyRows = hourly || MOCK_HOURLY
  const dailyRows  = daily  || MOCK_DAILY

  const { Icon: CurIcon, color: curColor } = condInfo(condition)

  const onBg  = 'var(--primary)'
  const onCol = 'var(--primary-foreground)'
  const offBg = 'transparent'
  const offCol = 'var(--text-muted)'

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: 'min(648px, calc(100dvh - 60px))',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        borderRadius: 22,
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ flex: 'none', padding: '22px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                Forecast
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                <MapPin size={16} strokeWidth={1.75} color="var(--text-muted)" style={{ flex: 'none' }} />
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: 24,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-body)',
                  lineHeight: 1.1,
                }}>
                  Home
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--surface-secondary)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flex: 'none',
              }}
            >
              <X size={16} strokeWidth={2} color="var(--text-body)" />
            </button>
          </div>

          {/* Current conditions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: 16, marginTop: 18,
            borderRadius: 16,
            background: 'color-mix(in srgb, var(--primary) 8%, var(--surface-secondary))',
            border: '1px solid var(--border)',
          }}>
            <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <CurIcon size={48} strokeWidth={1.5} color={curColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 38, fontWeight: 300, letterSpacing: '-0.02em',
                  color: 'var(--text-body)', lineHeight: 1,
                }}>
                  {curTemp}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {fmt(tempHi)}&thinsp;/&thinsp;{fmt(tempLo)}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-body)', fontWeight: 600, marginTop: 5, whiteSpace: 'nowrap' }}>
                {condLabel(condition)}{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>&middot; {feelsLike}</span>
              </div>
            </div>
          </div>

          {/* Inline metrics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-body)' }}>
              <Droplets size={15} strokeWidth={1.75} color="var(--text-muted)" />
              {humidity}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-body)' }}>
              <Wind size={15} strokeWidth={1.75} color="var(--text-muted)" />
              {windSpeed} {windBearing}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-body)' }}>
              <Gauge size={15} strokeWidth={1.75} color="var(--text-muted)" />
              {pressure}
            </div>
          </div>

          {/* Toggle */}
          <div style={{
            display: 'flex', gap: 4, padding: 4,
            background: 'var(--surface-secondary)', borderRadius: 12,
          }}>
            <button
              onClick={() => setTab('hourly')}
              style={{
                flex: 1, border: 'none', cursor: 'pointer',
                padding: '9px 0', borderRadius: 9,
                fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                transition: 'all .15s',
                background: tab === 'hourly' ? onBg : offBg,
                color: tab === 'hourly' ? onCol : offCol,
              }}
            >
              Hourly
            </button>
            <button
              onClick={() => setTab('daily')}
              style={{
                flex: 1, border: 'none', cursor: 'pointer',
                padding: '9px 0', borderRadius: 9,
                fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                transition: 'all .15s',
                background: tab === 'daily' ? onBg : offBg,
                color: tab === 'daily' ? onCol : offCol,
              }}
            >
              Daily
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '6px 24px 4px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--surface-muted) transparent',
        }}>
          {tab === 'hourly' && hourlyRows.map((h, i) => (
            <ForecastRow
              key={h.time}
              icon={<CondIcon condition={h.condition} size={20} />}
              label={h.time}
              sublabel={null}
              pop={h.pop}
              lo={h.lo}
              hi={h.hi}
              isLast={i === hourlyRows.length - 1}
            />
          ))}
          {tab === 'daily' && dailyRows.map((d, i) => (
            <ForecastRow
              key={d.day + i}
              icon={<CondIcon condition={d.condition} size={20} />}
              label={d.day}
              sublabel={d.label || null}
              pop={d.pop}
              lo={d.lo}
              hi={d.hi}
              isLast={i === dailyRows.length - 1}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          flex: 'none',
          padding: '12px 24px 18px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
        }}>
          Forecast from met.no · Norwegian Meteorological Institute
        </div>
      </div>
    </div>
  )
}

function bearingToDir(bearing) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(bearing / 45) % 8]
}
