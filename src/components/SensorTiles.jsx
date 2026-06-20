import * as Icons from 'lucide-react'
import { useHA } from '../ha/HAProvider.jsx'
import { SENSORS } from '../data/rooms.js'

export function SensorTiles() {
  const { entities } = useHA() || { entities: {} }

  return (
    <div className="pos-scroll-row" style={{ padding: '14px 20px 2px' }}>
      {SENSORS.map(s => {
        const entity = s.entityId ? entities[s.entityId] : null
        const value = entity ? entity.state : s.mockValue
        const Icon = Icons[s.icon] || Icons.Thermometer
        const isInside = s.id === 'inside'

        return (
          <div key={s.id} className="pos-card--slim" style={{ width: 150, flex: 'none' }}>
            <Icon
              size={24}
              strokeWidth={1.75}
              color={isInside ? 'var(--primary-grad-to)' : 'var(--text-muted)'}
              style={{ marginBottom: 6 }}
            />
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: 2,
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--text-body)',
            }}>
              {value}{s.unit}
            </div>
          </div>
        )
      })}
    </div>
  )
}
