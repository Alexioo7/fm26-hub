export function barColor(val, key) {
  const isLow = key === 'injuryProneness'
  const m = Math.round((val[0] + val[1]) / 2)
  if (isLow) return m <= 5 ? '#3fb950' : m <= 9 ? '#e8b84b' : '#f85149'
  return m >= 16 ? '#3fb950' : m >= 13 ? '#58a6ff' : m >= 9 ? '#e8b84b' : m >= 6 ? '#f97316' : '#f85149'
}

export function midVal(val) {
  return Math.round((val[0] + val[1]) / 2)
}

export default function AttrBar({ val, attrKey, showAvg }) {
  const m = midVal(val)
  const col = barColor(val, attrKey)
  const pct = (m / 20) * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, background: '#0d1117', borderRadius: 3, height: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 3, transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ color: col, fontSize: 10, fontWeight: 600, minWidth: 38, textAlign: 'right' }}>
        {val[0]}-{val[1]}
      </span>
      {showAvg && <span style={{ color: '#484f58', fontSize: 9, minWidth: 24 }}>({m})</span>}
    </div>
  )
}