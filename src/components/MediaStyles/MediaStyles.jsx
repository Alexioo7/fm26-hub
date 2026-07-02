import { useState } from 'react'
import { MEDIA_STYLES } from '../../data/mediaStyles'
import { PERSONALITIES, TIER_CONFIG } from '../../data/personalities'

const GRADE_COLOR = { S: '#e8b84b', A: '#3fb950', B: '#58a6ff', C: '#f97316', D: '#f85149' }

export default function MediaStyles() {
  const [selected, setSelected] = useState(null)

  const style = MEDIA_STYLES.find(m => m.name === selected)
  const compatible = selected
    ? PERSONALITIES.filter(p => p.media.includes(selected))
    : []

  return (
    <div>
      {/* Grid de styles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {MEDIA_STYLES.map(m => {
          const color = GRADE_COLOR[m.grade]
          const isActive = selected === m.name
          return (
            <div
              key={m.name}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => setSelected(isActive ? null : m.name)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(isActive ? null : m.name) } }}
              style={{
                background: isActive ? `${color}18` : '#161b22',
                border: `1px solid ${isActive ? color + '88' : '#21262d'}`,
                borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#e6edf3' }}>{m.label}</span>
                <span style={{ color, fontWeight: 800, fontSize: 11, background: `${color}22`, padding: '1px 7px', borderRadius: 4 }}>{m.grade}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {m.guarantees.map(g => (
                  <span key={g} style={{ fontSize: 9, background: `${color}18`, color, border: `1px solid ${color}33`, borderRadius: 3, padding: '1px 5px' }}>{g}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Détail */}
      {style && (
        <div style={{ background: '#161b22', border: `1px solid ${GRADE_COLOR[style.grade]}44`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#e6edf3' }}>{style.label}</span>
            <span style={{ color: GRADE_COLOR[style.grade], fontWeight: 800, fontSize: 14 }}>— {style.grade}</span>
          </div>
          <p style={{ fontSize: 12, color: '#93c5fd', margin: '0 0 12px', lineHeight: 1.6 }}>{style.desc}</p>
          <div style={{ fontSize: 11, color: '#7d8590', marginBottom: 8 }}>
            Compatible avec {compatible.length} personnalités :
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {compatible.map(p => {
              const cfg = TIER_CONFIG[p.tier]
              return (
                <span key={p.id} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 5,
                  background: `${cfg.color}15`, color: cfg.color,
                  border: `1px solid ${cfg.color}44`,
                }}>
                  {p.emoji} {p.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Table synthèse */}
      <div style={{ background: '#0c1a3a', border: '1px solid #1e40af44', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#93c5fd', lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, color: '#58a6ff', marginBottom: 6 }}>Règle clé</div>
        <div>• <strong style={{ color: '#e8b84b' }}>Évasif</strong> = Pro 15+ ET Pression 15+ garantis → transforme n'importe quelle personnalité</div>
        <div>• <strong style={{ color: '#3fb950' }}>Réservé</strong> = Pro 15+ garanti → Pression plafonnée à 14</div>
        <div>• <strong style={{ color: '#3fb950' }}>Imperturbable</strong> = Pression 15+ garanti → Tempérament 15+ aussi</div>
        <div>• <strong style={{ color: '#f85149' }}>Direct</strong> = Pression et Gros Matchs très bas garantis → éviter</div>
        <div>• <strong style={{ color: '#f85149' }}>Court-feu / Volatile</strong> = Tempérament minimal garanti → éviter</div>
      </div>
    </div>
  )
}
