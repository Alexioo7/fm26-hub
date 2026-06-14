export default function Nav({ tabs, active, onChange }) {
  return (
    <nav style={{
      display: 'flex',
      background: '#0d1117',
      borderBottom: '1px solid #21262d',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ display: 'flex', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {tabs.map(t => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                padding: '9px 13px',
                border: 'none',
                borderBottom: `2px solid ${isActive ? '#e8b84b' : 'transparent'}`,
                background: isActive ? '#e8b84b0e' : 'transparent',
                color: isActive ? '#e8b84b' : '#7d8590',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.12s',
                letterSpacing: '0.01em',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}