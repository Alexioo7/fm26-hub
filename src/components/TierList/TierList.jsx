import { useState } from 'react'
import { PERSONALITIES, TIERS, TIER_CONFIG, ATTRS } from '../../data/personalities'
import { mediaLabel } from '../../data/mediaStyles'
import Badge from '../ui/Badge'
import RingScore from '../ui/RingScore'
import AttrBar from '../ui/AttrBar'
import MediaTag from '../ui/MediaTag'
import Tooltip from '../ui/Tooltip'

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Grade du meilleur style dispo pour une personnalité
const MEDIA_GRADE_ORDER = ['Evasif', 'Imperturbable', 'Reserve', 'Confrontant', 'Pose', 'Amical', 'Volatile', 'Court-feu', 'Direct']
const MEDIA_GRADE = { Evasif: 'S', Imperturbable: 'A', Reserve: 'A', Confrontant: 'B', Pose: 'C', Amical: 'C', Volatile: 'D', 'Court-feu': 'D', Direct: 'D' }
const MEDIA_COLOR = { S: '#e8b84b', A: '#3fb950', B: '#58a6ff', C: '#f97316', D: '#f85149' }

function bestMedia(p) {
  for (const m of MEDIA_GRADE_ORDER) {
    if (p.media.includes(m)) return { name: m, grade: MEDIA_GRADE[m] }
  }
  return null
}

function DetailPanel({ p }) {
  return (
    <div style={{ padding: '12px 14px', background: '#0a0d14', borderTop: '1px solid #21262d' }}>
      {/* EN name + scores */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <Tooltip width={230} content="Score de développement (0-100) : potentiel de progression du joueur, basé surtout sur Professionnalisme, Détermination et Ambition.">
          <RingScore score={p.dev} size={44} label="Dev" />
        </Tooltip>
        <Tooltip width={230} content="Score de performance en match (0-100) : fiabilité dans les moments importants, basé sur Pression, Gros Matchs et Tempérament.">
          <RingScore score={p.pres} size={44} label="Pression" />
        </Tooltip>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#484f58', marginBottom: 4 }}>
            EN : <span style={{ color: '#7d8590' }}>{p.enName}</span>
          </div>
          <div style={{ fontSize: 10, color: '#484f58', marginBottom: 3 }}>Styles médias compatibles</div>
          <div>{p.media.map(m => <MediaTag key={m} name={m} />)}</div>
          {p.strengths.length > 0 && <>
            <div style={{ fontSize: 10, color: '#484f58', marginTop: 8, marginBottom: 3 }}>Forces</div>
            <div>{p.strengths.map(s => (
              <span key={s} style={{ display: 'inline-block', background: '#3fb95018', color: '#3fb950', border: '1px solid #3fb95044', borderRadius: 4, padding: '1px 7px', fontSize: 10, margin: 1 }}>{s}</span>
            ))}</div>
          </>}
          {p.weaknesses.length > 0 && <>
            <div style={{ fontSize: 10, color: '#484f58', marginTop: 6, marginBottom: 3 }}>Faiblesses</div>
            <div>{p.weaknesses.map(w => (
              <span key={w} style={{ display: 'inline-block', background: '#f8514918', color: '#f85149', border: '1px solid #f8514944', borderRadius: 4, padding: '1px 7px', fontSize: 10, margin: 1 }}>{w}</span>
            ))}</div>
          </>}
        </div>
      </div>

      {/* Attrs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 14px', marginBottom: 10 }}>
        {ATTRS.map(a => (
          <div key={a.key}>
            <div style={{ fontSize: 10, color: '#484f58', marginBottom: 3 }}>
              {a.icon}{' '}
              <Tooltip content={a.info}>
                <span className="has-tip">{a.label}</span>
              </Tooltip>
              {p.avg?.[a.key] !== undefined && (
                <span style={{ color: '#30363d', marginLeft: 4 }}>(moy. {p.avg[a.key]})</span>
              )}
            </div>
            <AttrBar val={p.attrs[a.key]} attrKey={a.key} />
          </div>
        ))}
      </div>

      {/* Tip */}
      <div style={{ background: '#0c1a3a', borderRadius: 8, padding: '9px 12px', border: '1px solid #1e40af44' }}>
        <span style={{ color: '#58a6ff', fontWeight: 700, fontSize: 11 }}>Conseil : </span>
        <span style={{ color: '#93c5fd', fontSize: 11 }}>{p.tip}</span>
      </div>
    </div>
  )
}

function PersonalityCard({ p }) {
  const [open, setOpen] = useState(false)
  const best = bestMedia(p)

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) }
        }}
        style={{
          padding: '10px 14px',
          cursor: 'pointer',
          borderBottom: '1px solid #21262d22',
          background: open ? '#1c2333' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#ffffff08' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }} aria-hidden="true">{p.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#e6edf3' }}>{p.name}</span>
              <Badge tier={p.tier} />
              {best && (
                <Tooltip width={220} content={`Meilleur style médias disponible pour cette personnalité : ${mediaLabel(best.name)} (grade ${best.grade}).`}>
                  <span style={{
                    fontSize: 9, padding: '1px 5px', borderRadius: 3,
                    background: `${MEDIA_COLOR[best.grade]}20`,
                    color: MEDIA_COLOR[best.grade],
                    border: `1px solid ${MEDIA_COLOR[best.grade]}44`,
                    fontWeight: 700,
                  }}>
                    {mediaLabel(best.name)}
                  </span>
                </Tooltip>
              )}
              <span style={{ fontSize: 9, color: '#484f58' }}>{p.enName}</span>
            </div>
            <div style={{ marginTop: 3 }}>
              {p.media.slice(0, 5).map(m => <MediaTag key={m} name={m} />)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <RingScore score={p.dev} size={34} label="Dev" />
            <RingScore score={p.pres} size={34} label="Pres" />
          </div>
          <span style={{ color: '#30363d', fontSize: 12, marginLeft: 4 }} aria-hidden="true">{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && <DetailPanel p={p} />}
    </div>
  )
}

function TierSection({ tier, list }) {
  const cfg = TIER_CONFIG[tier]
  return (
    <div style={{ borderRadius: 10, marginBottom: 10, overflow: 'hidden', border: `1px solid ${cfg.border}`, background: cfg.bg }}>
      <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${cfg.border}` }}>
        <span style={{ color: cfg.color, fontWeight: 800, fontSize: 13 }}>{cfg.label}</span>
        <span style={{ marginLeft: 'auto', background: `${cfg.color}22`, color: cfg.color, borderRadius: 20, padding: '1px 9px', fontSize: 10, fontWeight: 700 }}>
          {list.length}
        </span>
      </div>
      {list.map(p => <PersonalityCard key={p.id} p={p} />)}
    </div>
  )
}

export default function TierList({ search, setSearch, filter, setFilter }) {
  const q = search
  const filtered = PERSONALITIES.filter(p =>
    (norm(p.name).includes(norm(q)) || norm(p.enName).includes(norm(q))) &&
    (filter === 'ALL' || p.tier === filter)
  )
  const groups = TIERS.reduce((acc, t) => {
    acc[t] = filtered.filter(p => p.tier === t)
    return acc
  }, {})

  return (
    <div>
      {/* Source note */}
      <div style={{ background: '#0c1a3a', border: '1px solid #1e40af44', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 11, color: '#93c5fd' }}>
        <strong style={{ color: '#58a6ff' }}>Source :</strong> PEQ Beni Steam Guide — S = Excited · A = Good · B = Not Bad · C = Lottery/Mentoring · D = Terrible
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher en FR ou EN…"
            aria-label="Rechercher une personnalité"
            style={{
              width: '100%', padding: '9px 36px 9px 14px',
              background: '#161b22', border: '1px solid #30363d',
              borderRadius: 10, color: '#e6edf3', fontSize: 13, outline: 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Effacer la recherche"
              style={{
                position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#7d8590', fontSize: 16, lineHeight: 1, padding: '8px 10px',
              }}
            >✕</button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['ALL', ...TIERS].map(t => {
            const isActive = filter === t
            const color = t === 'ALL' ? '#e8b84b' : TIER_CONFIG[t]?.color
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                aria-pressed={isActive}
                style={{
                  padding: '0 12px', height: 40, borderRadius: 8,
                  border: `1px solid ${isActive ? color : '#30363d'}`,
                  background: isActive ? `${color}18` : '#161b22',
                  color: isActive ? color : '#7d8590',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  transition: 'all 0.15s',
                }}
              >{t === 'ALL' ? 'Tous' : t}</button>
            )
          })}
        </div>
      </div>

      {/* Tier sections */}
      {TIERS.map(tier => groups[tier]?.length > 0 && (
        <TierSection key={tier} tier={tier} list={groups[tier]} />
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#7d8590', padding: '40px 0', fontSize: 13 }}>
          Aucune personnalité trouvée pour « {search} »
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => { setSearch(''); setFilter('ALL') }}
              style={{ background: '#21262d', border: '1px solid #30363d', color: '#e8b84b', borderRadius: 8, padding: '8px 14px', fontSize: 12, cursor: 'pointer' }}
            >
              Réinitialiser la recherche
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
