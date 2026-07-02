import { useState } from 'react'
import { PERSONALITIES, ATTRS, TIER_CONFIG } from '../../data/personalities'
import Tooltip from '../ui/Tooltip'

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function TableView() {
  const [sortKey, setSortKey] = useState('professionalism')
  const [sortDir, setSortDir] = useState(-1)
  const [search, setSearch] = useState('')

  const toggle = (key) => {
    if (sortKey === key) setSortDir(d => -d)
    else { setSortKey(key); setSortDir(-1) }
  }

  const list = PERSONALITIES
    .filter(p => norm(p.name).includes(norm(search)) || norm(p.enName).includes(norm(search)))
    .sort((a, b) => {
      const aVal = a.avg?.[sortKey] ?? (a.attrs[sortKey][0] + a.attrs[sortKey][1]) / 2
      const bVal = b.avg?.[sortKey] ?? (b.attrs[sortKey][0] + b.attrs[sortKey][1]) / 2
      // sortDir -1 = décroissant (↓), 1 = croissant (↑)
      return (aVal - bVal) * sortDir
    })

  const thStyle = (key) => ({
    padding: '8px', fontSize: 10, fontWeight: 700,
    color: sortKey === key ? '#e8b84b' : '#7d8590',
    cursor: 'pointer', whiteSpace: 'nowrap', background: '#0d1117',
    borderBottom: `2px solid ${sortKey === key ? '#e8b84b44' : '#21262d'}`,
    userSelect: 'none',
  })

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher une personnalité"
          style={{ width: '100%', padding: '8px 36px 8px 14px', background: '#161b22', border: '1px solid #30363d', borderRadius: 10, color: '#e6edf3', fontSize: 13, outline: 'none' }}
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label="Effacer la recherche" style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7d8590', fontSize: 16, padding: '8px 10px' }}>✕</button>
        )}
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #21262d' }}>
        <table className="fm-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle(null), paddingLeft: 14, textAlign: 'left', minWidth: 150, cursor: 'default' }}>Personnalité</th>
              <th style={{ ...thStyle(null), textAlign: 'center', paddingLeft: 8, cursor: 'default' }}>Tier</th>
              {ATTRS.map(a => (
                <th
                  key={a.key}
                  onClick={() => toggle(a.key)}
                  style={thStyle(a.key)}
                  aria-sort={sortKey === a.key ? (sortDir === -1 ? 'descending' : 'ascending') : undefined}
                >
                  <Tooltip width={260} content={
                    <>
                      <span style={{ fontWeight: 700, color: '#e6edf3' }}>{a.icon} {a.label}</span>
                      <br />
                      {a.info}
                    </>
                  }>
                    <span className="has-tip">{a.short}</span>
                  </Tooltip>
                  {sortKey === a.key ? (sortDir === -1 ? ' ↓' : ' ↑') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => {
              const cfg = TIER_CONFIG[p.tier]
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#0d1117' : '#161b2288' }}>
                  <td style={{ padding: '8px 14px', fontSize: 12, color: '#e6edf3', whiteSpace: 'nowrap' }}>
                    <span style={{ marginRight: 6 }} aria-hidden="true">{p.emoji}</span>{p.name}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <span style={{ color: cfg.color, fontWeight: 800, fontSize: 11 }}>{p.tier}</span>
                  </td>
                  {ATTRS.map(a => {
                    const avg = p.avg?.[a.key] ?? Math.round((p.attrs[a.key][0] + p.attrs[a.key][1]) / 2)
                    const [lo, hi] = p.attrs[a.key]
                    const color = lo >= 15 ? '#3fb950' : hi <= 7 ? '#f85149' : lo >= 10 ? '#e8b84b' : '#7d8590'
                    return (
                      <td key={a.key} style={{ padding: '8px', textAlign: 'center', fontSize: 11, color, fontWeight: sortKey === a.key ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}
                        title={`${a.label} : plage ${lo}–${hi}, moyenne ${avg}`}>
                        {avg}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 10, color: '#7d8590', marginTop: 8, textAlign: 'right' }}>
        Valeurs moyennes · Clique sur un attribut pour trier · Survole un en-tête pour l'explication, une valeur pour la plage
      </div>
    </div>
  )
}
