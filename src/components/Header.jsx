import { useHA } from '../ha/HAProvider.jsx'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Header({ lightsOnCount }) {
  const { currentUser } = useHA() || {}

  const firstName = currentUser?.name?.split(' ')[0] || 'there'
  const greeting = `${getGreeting()}, ${firstName}`

  return (
    <div style={{ padding: '28px 20px 0' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        fontWeight: 600,
        color: 'var(--text-body)',
        lineHeight: 1.15,
      }}>
        {greeting}
      </div>
    </div>
  )
}
