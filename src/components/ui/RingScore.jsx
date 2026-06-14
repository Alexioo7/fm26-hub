export default function RingScore({ score, size = 44, label }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const fill = (Math.min(score, 100) / 100) * circ
  const color = score >= 80 ? '#3fb950' : score >= 60 ? '#58a6ff' : score >= 40 ? '#e8b84b' : '#f85149'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#21262d" strokeWidth={5} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        <text x={size/2} y={size/2 + 4} textAnchor="middle" fill={color} fontSize={size > 36 ? 11 : 9} fontWeight="700" fontFamily="Inter,system-ui">
          {score}
        </text>
      </svg>
      {label && <span style={{ fontSize: 9, color: '#7d8590', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>}
    </div>
  )
}