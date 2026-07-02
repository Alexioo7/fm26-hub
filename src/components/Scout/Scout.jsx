import { useState } from 'react'
import { PERSONALITIES, TIER_CONFIG } from '../../data/personalities'

const MODES = [
  { id: 'youth', icon: '🌱', label: 'Développement', desc: 'Meilleurs pour les jeunes' },
  { id: 'clutch', icon: '💎', label: 'Gros matchs', desc: 'Performent sous pression' },
  { id: 'captain', icon: '🏅', label: 'Capitaine', desc: 'Leadership vestiaire' },
  { id: 'risk', icon: '🚫', label: 'Risques', desc: 'Profils à fuir' },
]

const scoreFns = {
  youth:   p => p.dev,
  clutch:  p => p.pres,
  captain: p => (p.avg?.leadership ?? Math.round((p.attrs.leadership[0] + p.attrs.leadership[1]) / 2)) * 5,
  risk:    p => 100 - Math.round((p.dev * 0.7 + p.pres * 0.3)),
}

export default function Scout() {
  const [mode, setMode] = useState('youth')

  const sorted = [...PERSONALITIES]
    .map(p => ({ ...p, score: scoreFns[mode](p) }))
    .sort((a, b) => b.score - a.score)

  const isRisk = mode === 'risk'

  return (
    <div>
      {/* Mode selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
        {MODES.map(m => (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMode(m.id) } }}
            style={{
              background: mode === m.id ? '#e8b84b18' : '#161b22',
              border: `1px solid ${mode === m.id ? '#e8b84b88' : '#21262d'}`,
              borderRadius: 10, padding: '10px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 20 }}>{m.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: mode === m.id ? '#e8b84b' : '#e6edf3', marginTop: 4 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: '#484f58', marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Rankings */}
      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
        {sorted.map((p, i) => {
          const cfg = TIER_CONFIG[p.tier]
          const barColor = isRisk ? '#f85149' : '#e8b84b'
          const barWidth = Math.min(100, p.score)
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderBottom: i < sorted.length - 1 ? '1px solid #21262d33' : 'none',
              background: i < 3 ? `${barColor}08` : 'transparent',
            }}>
              <span style={{ fontSize: 10, color: '#484f58', width: 20, textAlign: 'right', flexShrink: 0 }}>
                {medal ?? `#${i + 1}`}
              </span>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{p.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#e6edf3' }}>{p.name}</div>
                <div style={{ height: 3, background: '#21262d', borderRadius: 2, marginTop: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${barWidth}%`, height: '100%', background: barColor, borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: isRisk ? '#f85149' : cfg.color, minWidth: 28, textAlign: 'right' }}>
                {p.score}
              </span>
              <span style={{ fontSize: 9, color: cfg.color, fontWeight: 800, minWidth: 12 }}>{p.tier}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
