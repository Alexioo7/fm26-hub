import { useState, useMemo } from 'react'
import { PERSONALITIES, ATTRS, TIER_CONFIG, MEDIA_RANGES } from '../../data/personalities'
import { MEDIA_STYLES } from '../../data/mediaStyles'

const MEDIA_NAMES = Object.keys(MEDIA_RANGES)

function intersect(pRange, mRange) {
  if (!mRange) return pRange
  const lo = Math.max(pRange[0], mRange[0])
  const hi = Math.min(pRange[1], mRange[1])
  return lo <= hi ? [lo, hi] : null
}

function midpoint(range) {
  if (!range) return 0
  return (range[0] + range[1]) / 2
}

function getAttrColor(range) {
  if (!range) return '#f85149'
  const [lo, hi] = range
  if (lo >= 15) return '#3fb950'
  if (hi <= 7) return '#f85149'
  if (lo >= 10) return '#e8b84b'
  return '#f97316'
}

function getAttrBg(range) {
  if (!range) return '#2d080844'
  const [lo, hi] = range
  if (lo >= 15) return '#3fb95015'
  if (hi <= 7) return '#f8514915'
  if (lo >= 10) return '#e8b84b15'
  return '#f9731615'
}

function calcScore(personality, mediaName) {
  const mRanges = MEDIA_RANGES[mediaName] || {}
  const p = personality

  const combineAttr = (key) => {
    const pr = p.attrs[key]
    const mr = mRanges[key]
    return intersect(pr, mr)
  }

  const pro   = combineAttr('professionalism')
  const pres  = combineAttr('pressure')
  const imp   = combineAttr('importantMatches')
  const det   = combineAttr('determination')
  const amb   = combineAttr('ambition')
  const tem   = combineAttr('temperament')

  // Dev score (0-100): professionalism 40%, determination 35%, ambition 25%
  const devScore =
    (midpoint(pro) / 20) * 40 +
    (midpoint(det) / 20) * 35 +
    (midpoint(amb) / 20) * 25

  // Match score (0-100): pressure 50%, importantMatches 35%, temperament 15%
  const matchScore =
    (midpoint(pres) / 20) * 50 +
    (midpoint(imp) / 20) * 35 +
    (midpoint(tem) / 20) * 15

  const total = Math.round(devScore * 0.7 + matchScore * 0.3)

  const gradeThresholds = [
    [90, 'S'], [75, 'A'], [60, 'B'], [45, 'C'], [0, 'D']
  ]
  const grade = gradeThresholds.find(([t]) => total >= t)[1]

  return { total, devScore: Math.round(devScore), matchScore: Math.round(matchScore), grade }
}

function findBestCombos(personality) {
  const available = personality.media
  return MEDIA_NAMES
    .filter(m => available.includes(m))
    .map(m => ({ media: m, ...calcScore(personality, m) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
}

function GradeBadge({ grade, size = 'md' }) {
  const cfg = TIER_CONFIG[grade] || TIER_CONFIG.D
  const p = size === 'lg' ? '6px 18px' : '3px 10px'
  const fs = size === 'lg' ? 20 : 12
  return (
    <span style={{
      background: `${cfg.color}22`,
      color: cfg.color,
      border: `1px solid ${cfg.color}66`,
      borderRadius: 6,
      padding: p,
      fontWeight: 800,
      fontSize: fs,
    }}>{grade}</span>
  )
}

function AttrRow({ attrKey, label, icon, range }) {
  const color = getAttrColor(range)
  const bg = getAttrBg(range)
  const pct = range ? Math.round((midpoint(range) / 20) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #21262d33' }}>
      <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{icon}</span>
      <span style={{ fontSize: 11, color: '#7d8590', flex: 1 }}>{label}</span>
      {range ? (
        <>
          <span style={{ fontSize: 10, color, fontWeight: 700, minWidth: 56, textAlign: 'right' }}>
            {range[0]}–{range[1]}
          </span>
          <div style={{ width: 60, height: 6, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
          </div>
        </>
      ) : (
        <span style={{ fontSize: 10, color: '#f85149', fontWeight: 700 }}>Incompatible</span>
      )}
    </div>
  )
}

export default function ComboAnalyser() {
  const [persoId, setPersoId] = useState('')
  const [mediaName, setMediaName] = useState('')
  const [age, setAge] = useState('')
  const [det, setDet] = useState('')
  const [lead, setLead] = useState('')

  const personality = PERSONALITIES.find(p => p.id === persoId)
  const mediaStyle = MEDIA_STYLES.find(m => m.name === mediaName)

  const isMediaCompatible = personality && mediaName
    ? personality.media.includes(mediaName)
    : true

  const result = useMemo(() => {
    if (!personality || !mediaName || !isMediaCompatible) return null
    return calcScore(personality, mediaName)
  }, [personality, mediaName, isMediaCompatible])

  const bestCombos = useMemo(() => {
    if (!personality) return []
    return findBestCombos(personality)
  }, [personality])

  // If visible determination is given, narrow the personality's Det range
  const refinedPersonalityAttrs = useMemo(() => {
    if (!personality) return {}
    const base = { ...personality.attrs }
    if (det) {
      const d = parseInt(det)
      if (!isNaN(d) && d >= 1 && d <= 20) {
        const [lo, hi] = base.determination
        // Visible det must fall within personality's range — narrow to exact value
        const clampedLo = Math.max(lo, d)
        const clampedHi = Math.min(hi, d)
        if (clampedLo <= clampedHi) {
          base.determination = [clampedLo, clampedHi]
        }
      }
    }
    return base
  }, [personality, det])

  const combinedAttrs = useMemo(() => {
    if (!personality) return {}
    const mRanges = MEDIA_RANGES[mediaName] || {}
    return ATTRS.reduce((acc, a) => {
      const pr = refinedPersonalityAttrs[a.key] ?? personality.attrs[a.key]
      const mr = mRanges[a.key]
      acc[a.key] = mr ? intersect(pr, mr) : pr
      return acc
    }, {})
  }, [personality, mediaName, refinedPersonalityAttrs])

  const gradeColor = result ? (TIER_CONFIG[result.grade]?.color || '#7d8590') : '#7d8590'

  const verdictText = result ? (() => {
    if (result.total >= 90) return 'Profil exceptionnel — signe immédiatement.'
    if (result.total >= 75) return 'Très bon profil — priorité recrutement.'
    if (result.total >= 60) return 'Profil correct — exploitable avec mentor.'
    if (result.total >= 45) return 'Profil risqué — signe seulement si besoin.'
    return 'Profil à éviter — ne pas signer.'
  })() : null

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e8b84b' }}>
          🔬 Combo Analyser
        </h2>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>Personnalité</label>
            <select
              value={persoId}
              onChange={e => setPersoId(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
            >
              <option value="">— Choisir —</option>
              {['S','A','B','C','D'].map(tier => (
                <optgroup key={tier} label={`Tier ${tier}`}>
                  {PERSONALITIES.filter(p => p.tier === tier).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>Style médias</label>
            <select
              value={mediaName}
              onChange={e => setMediaName(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
            >
              <option value="">— Choisir —</option>
              {MEDIA_STYLES.map(m => (
                <option key={m.name} value={m.name}>{m.name} ({m.grade})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>Âge (optionnel)</label>
            <input
              type="number" min="15" max="40" value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="ex: 19"
              style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>Détermination visible</label>
            <input
              type="number" min="1" max="20" value={det}
              onChange={e => setDet(e.target.value)}
              placeholder="1–20"
              style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
            />
          </div>
        </div>

        {/* Incompatible warning */}
        {personality && mediaName && !isMediaCompatible && (
          <div style={{ background: '#2d080888', border: '1px solid #f8514944', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            <span style={{ color: '#f85149', fontWeight: 700, fontSize: 12 }}>⚠ Style incompatible</span>
            <div style={{ fontSize: 11, color: '#7d8590', marginTop: 4 }}>
              {personality.name} n'est pas disponible avec le style {mediaName}.
            </div>
            <div style={{ fontSize: 11, color: '#e8b84b', marginTop: 4 }}>
              Styles disponibles : {personality.media.join(', ')}
            </div>
          </div>
        )}

        {/* Styles dispo pour la perso */}
        {personality && !mediaName && (
          <div style={{ background: '#0c1a3a', border: '1px solid #58a6ff33', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#58a6ff' }}>Styles disponibles : </span>
            <span style={{ fontSize: 11, color: '#93c5fd' }}>{personality.media.join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div style={{ background: '#161b22', border: `1px solid ${gradeColor}44`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          {/* Score header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <GradeBadge grade={result.grade} size="lg" />
              <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor, marginTop: 4 }}>{result.total}</div>
              <div style={{ fontSize: 9, color: '#484f58' }}>/ 100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>{verdictText}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#3fb95015', border: '1px solid #3fb95033', borderRadius: 6, padding: '5px 8px' }}>
                  <div style={{ fontSize: 9, color: '#3fb950', marginBottom: 2 }}>DEV (70%)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#3fb950' }}>{result.devScore}</div>
                </div>
                <div style={{ flex: 1, background: '#58a6ff15', border: '1px solid #58a6ff33', borderRadius: 6, padding: '5px 8px' }}>
                  <div style={{ fontSize: 9, color: '#58a6ff', marginBottom: 2 }}>MATCH (30%)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#58a6ff' }}>{result.matchScore}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Det refinement note */}
          {det && (() => {
            const d = parseInt(det)
            const [lo, hi] = personality.attrs.determination
            if (!isNaN(d) && d >= lo && d <= hi) {
              return (
                <div style={{ background: '#e8b84b10', border: '1px solid #e8b84b33', borderRadius: 6, padding: '7px 10px', marginBottom: 10, fontSize: 11, color: '#e8b84b' }}>
                  🎯 Détermination visible = {d} — analyse affinée pour ce joueur précis
                </div>
              )
            } else if (!isNaN(d) && (d < lo || d > hi)) {
              return (
                <div style={{ background: '#f9731615', border: '1px solid #f9731633', borderRadius: 6, padding: '7px 10px', marginBottom: 10, fontSize: 11, color: '#f97316' }}>
                  ⚠ Détermination {d} hors de la plage {lo}–{hi} pour {personality.name} — vérifier la personnalité
                </div>
              )
            }
            return null
          })()}

          {/* Age warning */}
          {age && parseInt(age) > 22 && personality.id === 'bornLeader' && (
            <div style={{ background: '#3fb95015', border: '1px solid #3fb95033', borderRadius: 6, padding: '7px 10px', marginBottom: 12, fontSize: 11, color: '#3fb950' }}>
              ✓ Âge {age} ans — Born Leader disponible (23+ requis)
            </div>
          )}
          {age && parseInt(age) < 23 && ['bornLeader','leader'].includes(personality.id) && (
            <div style={{ background: '#f9731615', border: '1px solid #f9731633', borderRadius: 6, padding: '7px 10px', marginBottom: 12, fontSize: 11, color: '#f97316' }}>
              ⚠ Âge {age} ans — cette personnalité n'apparaît que chez les 23 ans et plus
            </div>
          )}

          {/* Attributs */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#484f58', marginBottom: 6 }}>Attributs après croisement perso × style médias</div>
            {ATTRS.map(a => (
              <AttrRow key={a.key} attrKey={a.key} label={a.label} icon={a.icon} range={combinedAttrs[a.key]} />
            ))}
          </div>

          {/* Légende */}
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#7d8590', padding: '6px 0', borderTop: '1px solid #21262d' }}>
            <span style={{ color: '#3fb950' }}>■ Garanti 15+</span>
            <span style={{ color: '#e8b84b' }}>■ Correct 10–14</span>
            <span style={{ color: '#f97316' }}>■ Variable</span>
            <span style={{ color: '#f85149' }}>■ Mauvais / Incompat.</span>
          </div>
        </div>
      )}

      {/* Top 3 combos */}
      {personality && bestCombos.length > 0 && (
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#7d8590', marginBottom: 10 }}>🏆 Meilleurs combos pour {personality.name}</div>
          {bestCombos.map((c, i) => {
            const cfg = TIER_CONFIG[c.grade]
            const isCurrent = c.media === mediaName
            return (
              <div
                key={c.media}
                onClick={() => setMediaName(c.media)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                  background: isCurrent ? `${cfg.color}18` : '#ffffff05',
                  border: `1px solid ${isCurrent ? cfg.color + '44' : '#21262d'}`,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 11, color: '#484f58', width: 16 }}>#{i + 1}</span>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#e6edf3', flex: 1 }}>{c.media}</span>
                <GradeBadge grade={c.grade} />
                <span style={{ fontSize: 14, fontWeight: 800, color: cfg.color, minWidth: 32, textAlign: 'right' }}>{c.total}</span>
              </div>
            )
          })}
          <div style={{ fontSize: 10, color: '#484f58', marginTop: 6 }}>Clique sur un combo pour le sélectionner</div>
        </div>
      )}
    </div>
  )
}
