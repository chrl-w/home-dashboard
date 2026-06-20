import { useHA } from '../ha/HAProvider.jsx'
import { PERSONS } from '../data/rooms.js'

export function Header({ lightsOnCount }) {
  const { entities, currentUser } = useHA() || {}

  const persons = PERSONS.map(p => {
    const entity = entities?.[p.id]
    const isHome = entity?.state === 'home'
    const name = entity?.attributes?.friendly_name || p.initials
    const initial = name.charAt(0).toUpperCase()
    return { ...p, isHome, initial, name }
  })

  const homeCount = persons.filter(p => p.isHome).length
  const lightsLabel = lightsOnCount === 0
    ? 'All lights off'
    : `${lightsOnCount} light${lightsOnCount !== 1 ? 's' : ''} on`
  const summary = homeCount > 0
    ? `${lightsLabel} · ${homeCount} home`
    : lightsLabel

  const displayName = currentUser?.name?.split(' ')[0] || 'Home'

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="pos-avatar-stack">
          {persons.map(p => (
            <div
              key={p.id}
              className="pos-avatar"
              title={`${p.name} — ${p.isHome ? 'home' : 'away'}`}
              style={{ opacity: p.isHome ? 1 : 0.35 }}
            >
              {p.initial}
            </div>
          ))}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text-body)',
            lineHeight: 1.2,
          }}>
            {displayName}
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginTop: 1,
          }}>
            {summary}
          </div>
        </div>
      </div>
    </div>
  )
}
