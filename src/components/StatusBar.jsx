import { useEffect, useState } from 'react'
import { Signal, Battery } from 'lucide-react'

export function StatusBar() {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 24px 4px',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text-body)',
        letterSpacing: '0.02em',
      }}>
        {time}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
        <Signal size={14} strokeWidth={1.75} />
        <Battery size={16} strokeWidth={1.75} />
      </div>
    </div>
  )
}

function getTime() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}
