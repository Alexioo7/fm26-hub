export default function Sidebar({ tabs, active, onChange }) {
  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <div style={{ fontSize: 10, color: '#484f58', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 6 }}>
        Outils
      </div>
      {tabs.map(t => {
        const isActive = active === t.id
        const Icon = t.icon
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px',
              border: 'none', borderRadius: 8,
              background: isActive ? '#e8b84b14' : 'transparent',
              color: isActive ? '#e8b84b' : '#7d8590',
              cursor: 'pointer', fontSize: 13, textAlign: 'left',
              fontWeight: isActive ? 600 : 500,
              transition: 'color 0.12s, background 0.12s',
              boxShadow: isActive ? 'inset 2px 0 0 #e8b84b' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#ffffff08'; e.currentTarget.style.color = '#e6edf3' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7d8590' } }}
          >
            <Icon size={16} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
            {t.label}
          </button>
        )
      })}
    </aside>
  )
}
