import { TIER_CONFIG, TIERS } from '../../data/personalities'

export default function Header({ counts, total }) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
      borderBottom: '1px solid #21262d',
      padding: '10px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 900, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{
          width: 34, height: 34, flexShrink: 0,
          background: 'linear-gradient(135deg, #e8b84b, #c49a2e)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000',
          boxShadow: '0 0 12px #e8b84b44',
        }}>FM</div>

        {/* Title */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#e6edf3', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            FM26 Personality Hub
          </div>
          <div style={{ fontSize: 10, color: '#484f58', marginTop: 1 }}>
            {total} personnalités · Sources : PEQ Beni, SortItOutSI, traductions vérifiées en jeu
          </div>
        </div>

        {/* Tier pills */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
          {TIERS.map(t => (
            <div key={t} style={{
              background: `${TIER_CONFIG[t].color}18`,
              border: `1px solid ${TIER_CONFIG[t].color}44`,
              borderRadius: 6, padding: '2px 8px', textAlign: 'center',
            }}>
              <span style={{ color: TIER_CONFIG[t].color, fontWeight: 800, fontSize: 12 }}>{t}</span>
              <span style={{ color: '#484f58', fontSize: 9, marginLeft: 4 }}>{counts[t]}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}