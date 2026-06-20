export function Header({ lightsOnCount, membersHome }) {
  const summary = lightsOnCount === 0
    ? `All lights off · ${membersHome} home`
    : `${lightsOnCount} light${lightsOnCount !== 1 ? 's' : ''} on · ${membersHome} home`

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="pos-avatar-stack">
          <div className="pos-avatar">A</div>
          <div className="pos-avatar">S</div>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text-body)',
            lineHeight: 1.2,
          }}>
            Home
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
