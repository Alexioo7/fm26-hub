import { useState } from 'react'
import { PERSONALITIES, ATTRS, TIER_CONFIG } from '../../data/personalities'
import { mediaLabel } from '../../data/mediaStyles'
import Badge from '../ui/Badge'
import Tooltip from '../ui/Tooltip'
import { AttrIcon } from '../ui/icons'
import { AlertTriangle, CircleCheck, Lightbulb } from 'lucide-react'

const attrByKey = (key) => ATTRS.find(a => a.key === key)

/*
  Mentoring logic in FM26:
  - A mentor must be in the same position group, same squad, 5+ years older (or 23+)
  - The mentee gains attributes pushed toward the mentor's personality over time
  - Key: pair a player who lacks X with a mentor who has X guaranteed high
*/

const MENTORING_NEEDS = [
  {
    id: 'low_pro',
    label: 'Faible Professionnalisme',
    icon: '📋',
    desc: 'Pro garantie basse — développement entravé',
    personalities: ['jovial', 'casual', 'slack', 'temperamental'],
    needAttr: 'professionalism',
    idealMentorAttrs: { professionalism: 18 },
    idealMentors: ['modelcitizen', 'modelPro', 'bornLeader', 'professional', 'fairlyPro', 'resolute'],
    advice: 'Mentor avec Pro 18-20 garanti. Le Professionnel Modèle ou le Citoyen Modèle sont idéaux. Le style Évasif ou Réservé du mentor amplifie l\'effet.',
  },
  {
    id: 'low_det',
    label: 'Faible Détermination',
    icon: '🔥',
    desc: 'Det garantie très basse — résignation face aux obstacles',
    personalities: ['easilyDiscouraged', 'lowDetermination', 'spineless', 'slack', 'casual'],
    needAttr: 'determination',
    idealMentors: ['bornLeader', 'driven', 'determined', 'ironWilled', 'perfectionist'],
    advice: 'Mentor avec Dét 18-20. Le Leader Né a Dét 20 garantie. D\'Acier et Extrêmement Déterminé ont une Dét très haute garantie.',
  },
  {
    id: 'low_pres',
    label: 'Faible Pression',
    icon: '💎',
    desc: 'Joueur fantôme dans les gros matchs',
    personalities: ['spineless', 'lowSelfBelief', 'easilyDiscouraged'],
    needAttr: 'pressure',
    idealMentors: ['ironWilled', 'modelcitizen', 'resilient', 'spirited', 'lightHearted', 'jovial'],
    advice: 'Mentor avec Pression garantie élevée. D\'Acier a Pression 20 absolue — le meilleur mentor pour ce profil. Style Imperturbable du mentor garantit Pression 15+.',
  },
  {
    id: 'low_tem',
    label: 'Tempérament bas',
    icon: '🧊',
    desc: 'Cartons et suspensions fréquents',
    personalities: ['temperamental', 'lowSelfBelief'],
    needAttr: 'temperament',
    idealMentors: ['charismaticLeader', 'modelcitizen', 'lightHearted', 'spirited', 'professional', 'modelPro'],
    advice: 'Mentor avec Tempérament 15+. Le Leader Charismatique a Tem 18-20 garanti — idéal. Style Imperturbable du mentor garantit aussi Tem 15+.',
  },
  {
    id: 'low_amb',
    label: 'Faible Ambition',
    icon: '🎯',
    desc: 'Stagnation — peu motivé pour progresser',
    personalities: ['unambitious', 'veryLoyal', 'devoted', 'loyal', 'lowDetermination'],
    needAttr: 'ambition',
    idealMentors: ['bornLeader', 'perfectionist', 'driven', 'veryAmbitious', 'ambitious', 'fickle'],
    advice: 'Mentor avec Ambition 14+. Attention : un mentor très ambitieux peut rendre le joueur moins loyal. Équilibre à trouver.',
  },
]

// Get personality object by id, with null-safety
const byId = (id) => PERSONALITIES.find(p => p.id === id)

// Get average for an attr
const avgAttr = (p, key) =>
  p.avg?.[key] ?? Math.round((p.attrs[key][0] + p.attrs[key][1]) / 2)

export default function Mentoring() {
  const [activeNeed, setActiveNeed] = useState('low_pro')
  const [menteeId, setMenteeId] = useState('')

  const need = MENTORING_NEEDS.find(n => n.id === activeNeed)
  const mentee = PERSONALITIES.find(p => p.id === menteeId)

  // Score a mentor for this need
  const scoreMentor = (mentor, need) => {
    const val = avgAttr(mentor, need.needAttr)
    const tierBonus = { S: 20, A: 15, B: 10, C: 5, D: 0 }[mentor.tier]
    return val + tierBonus * 0.3
  }

  // All mentors that have the needed attr high, sorted
  const suggestedMentors = [...PERSONALITIES]
    .filter(p => avgAttr(p, need.needAttr) >= 14)
    .sort((a, b) => scoreMentor(b, need) - scoreMentor(a, need))
    .slice(0, 8)

  // Mentee needy personalities for the selected need
  const needyPersonalities = need.personalities.map(byId).filter(Boolean)

  return (
    <div>
      {/* Explainer */}
      <div style={{ background: '#0c1a3a', border: '1px solid #1e40af44', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 11, color: '#93c5fd', lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, color: '#58a6ff', marginBottom: 4 }}>Comment fonctionne le mentoring FM26</div>
        <div>• Le mentor doit être dans le <strong>même groupe de position</strong> et avoir <strong>5+ ans de plus</strong> (ou 23+ ans)</div>
        <div>• Le protégé adopte progressivement la <strong>personnalité du mentor</strong> au fil des saisons</div>
        <div>• Un bon mentoring peut transformer un <span style={{ color: '#f85149' }}>Tier D</span> en <span style={{ color: '#f97316' }}>Tier C</span> viable</div>
        <div>• Le <strong>style médias du mentor</strong> amplifie l'effet — Évasif ou Réservé = meilleur transfert de Pro</div>
      </div>

      {/* Need selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
        {MENTORING_NEEDS.map(n => {
          const isActive = n.id === activeNeed
          return (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => { setActiveNeed(n.id); setMenteeId('') }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveNeed(n.id); setMenteeId('') } }}
              style={{
                background: isActive ? '#e8b84b18' : '#161b22',
                border: `1px solid ${isActive ? '#e8b84b88' : '#21262d'}`,
                borderRadius: 8, padding: '8px 6px', cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.12s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AttrIcon attrKey={n.needAttr} size={18} color={isActive ? '#e8b84b' : '#7d8590'} />
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? '#e8b84b' : '#7d8590', marginTop: 5, lineHeight: 1.3 }}>{n.label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Left: qui a besoin d'un mentor */}
        <div style={{ background: '#161b22', border: '1px solid #f8514933', borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#f85149', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={13} strokeWidth={2} aria-hidden="true" />
            Personnalités qui en ont besoin
          </div>
          {needyPersonalities.map(p => (
            <div
              key={p.id}
              onClick={() => setMenteeId(p.id === menteeId ? '' : p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                borderRadius: 7, marginBottom: 4, cursor: 'pointer',
                background: menteeId === p.id ? '#f8514920' : '#ffffff05',
                border: `1px solid ${menteeId === p.id ? '#f8514966' : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: 16 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#e6edf3' }}>{p.name}</div>
                <div style={{ fontSize: 9, color: '#7d8590' }}>
                  {attrByKey(need.needAttr).label} : {p.attrs[need.needAttr][0]}–{p.attrs[need.needAttr][1]}
                </div>
              </div>
              <Badge tier={p.tier} />
            </div>
          ))}
          <div style={{ fontSize: 10, color: '#484f58', marginTop: 6 }}>Clique pour sélectionner le joueur à mentorer</div>
        </div>

        {/* Right: meilleurs mentors */}
        <div style={{ background: '#161b22', border: '1px solid #3fb95033', borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#3fb950', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CircleCheck size={13} strokeWidth={2} aria-hidden="true" />
            Meilleurs mentors
          </div>
          {suggestedMentors.map((p, i) => {
            const val = avgAttr(p, need.needAttr)
            const cfg = TIER_CONFIG[p.tier]
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px',
                borderRadius: 7, marginBottom: 4,
                background: i < 3 ? `${cfg.color}08` : '#ffffff03',
              }}>
                <span style={{ fontSize: 10, width: 16 }}>{medal ?? ''}</span>
                <span style={{ fontSize: 14 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#e6edf3' }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: '#7d8590' }}>
                    Moy {attrByKey(need.needAttr).short} : <span style={{ color: val >= 15 ? '#3fb950' : '#e8b84b', fontWeight: 700 }}>{val}</span>
                    <span style={{ marginLeft: 6 }}>Styles : {p.media.slice(0, 3).map(mediaLabel).join(', ')}</span>
                  </div>
                </div>
                <Badge tier={p.tier} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Mentee detail */}
      {mentee && (
        <div style={{ background: '#161b22', border: `1px solid ${TIER_CONFIG[mentee.tier].color}44`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#e6edf3', marginBottom: 8 }}>
            {mentee.emoji} Profil de {mentee.name} — Ce qu'un mentor peut améliorer
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(['professionalism', 'pressure', 'determination', 'ambition', 'temperament', 'loyalty'] ).map(key => {
              const [lo, hi] = mentee.attrs[key]
              const avg = mentee.avg?.[key] ?? Math.round((lo + hi) / 2)
              const isWeak = avg < 10
              const isNeed = key === need.needAttr
              return (
                <div key={key} style={{
                  padding: '6px 8px', borderRadius: 6,
                  background: isNeed ? '#e8b84b15' : isWeak ? '#f8514910' : '#ffffff05',
                  border: `1px solid ${isNeed ? '#e8b84b44' : isWeak ? '#f8514933' : '#21262d'}`,
                }}>
                  <div style={{ fontSize: 9, color: '#484f58', marginBottom: 2 }}>
                    <Tooltip content={attrByKey(key).info}>
                      <span className="has-tip">{attrByKey(key).short.toUpperCase()}</span>
                    </Tooltip>
                    {isNeed && ' ← CIBLE'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isNeed ? '#e8b84b' : isWeak ? '#f85149' : '#7d8590' }}>{avg}</div>
                  <div style={{ fontSize: 8, color: '#30363d' }}>{lo}–{hi}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Conseil */}
      <div style={{ background: '#0c1a3a', border: '1px solid #1e40af44', borderRadius: 8, padding: '10px 14px' }}>
        <span style={{ fontSize: 11, color: '#58a6ff', fontWeight: 700 }}>
          <Lightbulb size={12} strokeWidth={2} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />
          Conseil pour {need.label} :{' '}
        </span>
        <span style={{ fontSize: 11, color: '#93c5fd' }}>{need.advice}</span>
      </div>
    </div>
  )
}
