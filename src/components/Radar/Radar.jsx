import { useState } from 'react'
import { PERSONALITIES, RADAR_KEYS, ATTRS, TIER_CONFIG } from '../../data/personalities'

const LABELS = { professionalism: 'Pro', pressure: 'Pres', importantMatches: 'Imp', ambition: 'Amb', determination: 'Det', temperament: 'Tem' }

function RadarChart({ personality, size = 220 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const n = RADAR_KEYS.length
  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  const points = RADAR_KEYS.map((key, i) => {
    const avg = personality.avg?.[key] ?? Math.round((personality.attrs[key][0] + personality.attrs[key][1]) / 2)
    const ratio = avg / 20
    const angle = startAngle + i * angleStep
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
      lx: cx + (r + 22) * Math.cos(angle),
      ly: cy + (r + 22) * Math.sin(angle),
      label: LABELS[key],
      val: avg,
    }
  })

  const polygon = points.map(p => `${p.x},${p.y}`).join(' ')
  const cfg = TIER_CONFIG[personality.tier]

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]
  const gridLines = RADAR_KEYS.map((_, i) => {
    const angle = startAngle + i * angleStep
    return { x2: cx + r * Math.cos(angle), y2: cy + r * Math.sin(angle) }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map(ratio => {
        const pts = RADAR_KEYS.map((_, i) => {
          const angle = startAngle + i * angleStep
          return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={ratio} points={pts} fill="none" stroke="#21262d" strokeWidth="1" />
      })}
      {gridLines.map((l, i) => (
        <line key={i} x1={cx} y1={cy} x2={l.x2} y2={l.y2} stroke="#21262d" strokeWidth="1" />
      ))}
      <polygon points={polygon} fill={`${cfg.color}25`} stroke={cfg.color} strokeWidth="1.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill={cfg.color} />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#7d8590">{p.label}</text>
          <text x={p.lx} y={p.ly + 10} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={cfg.color} fontWeight="700">{p.val}</text>
        </g>
      ))}
    </svg>
  )
}

export default function Radar() {
  const [id, setId] = useState(PERSONALITIES[0].id)
  const personality = PERSONALITIES.find(p => p.id === id)
  const cfg = TIER_CONFIG[personality.tier]

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>Personnalité</label>
        <select
          value={id} onChange={e => setId(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
        >
          {['S','A','B','C','D'].map(tier => (
            <optgroup key={tier} label={`Tier ${tier}`}>
              {PERSONALITIES.filter(p => p.tier === tier).map(p => (
                <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div style={{ background: '#161b22', border: `1px solid ${cfg.color}44`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 8, textAlign: 'center' }}>
          <span style={{ fontSize: 24 }}>{personality.emoji}</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#e6edf3', marginTop: 4 }}>{personality.name}</div>
          <div style={{ fontSize: 10, color: '#7d8590' }}>{personality.enName}</div>
        </div>
        <RadarChart personality={personality} size={240} />
        <div style={{ fontSize: 10, color: '#484f58', marginTop: 4 }}>6 attributs clés · Moyennes</div>
      </div>

      {/* Mini summary */}
      <div style={{ marginTop: 12, background: '#0c1a3a', border: '1px solid #1e40af44', borderRadius: 8, padding: '10px 14px' }}>
        <span style={{ fontSize: 11, color: '#58a6ff', fontWeight: 700 }}>Conseil : </span>
        <span style={{ fontSize: 11, color: '#93c5fd' }}>{personality.tip}</span>
      </div>
    </div>
  )
}
