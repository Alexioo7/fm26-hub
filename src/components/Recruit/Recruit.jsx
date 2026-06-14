import { PERSONALITIES, TIER_CONFIG } from '../../data/personalities'
import Badge from '../ui/Badge'

const PROFILES = [
  {
    id: 'youth',
    icon: '🌱',
    label: 'Jeune à potentiel',
    desc: 'Top personnalités pour le développement des newgens et jeunes joueurs',
    filter: p => p.dev >= 75,
    sortKey: 'dev',
    tip: 'Priorité : Professionnalisme et Détermination garantis. Le style Évasif ou Réservé multiplie la valeur du joueur.',
  },
  {
    id: 'pressure',
    icon: '💎',
    label: 'Gros matchs',
    desc: 'Joueurs qui performent sous pression — finales, derbies, champions league',
    filter: p => p.pres >= 72,
    sortKey: 'pres',
    tip: 'Priorité : Pression et Gros Matchs garantis élevés. Style Imperturbable = Pression 15+ garanti.',
  },
  {
    id: 'captain',
    icon: '🏅',
    label: 'Capitaine',
    desc: 'Meilleur leadership pour mener le vestiaire',
    filter: p => {
      const leadAvg = p.avg?.leadership ?? Math.round((p.attrs.leadership[0] + p.attrs.leadership[1]) / 2)
      return leadAvg >= 15
    },
    sortKey: 'dev',
    tip: 'Leadership 15+ en moyenne. Born Leader et Charismatic Leader = les deux uniques avec Leadership 19-20 garanti.',
  },
  {
    id: 'avoid',
    icon: '🚫',
    label: 'À éviter',
    desc: 'Profils à fuir — mauvais développement ou performances en match catastrophiques',
    filter: p => p.tier === 'D' || (p.dev < 30 && p.pres < 30),
    sortKey: 'dev',
    tip: 'Éviter absolument : Friable (Pression 1 garanti), Indolent (Pro 1 garanti), En Manque de Confiance (Pression 2-3).',
  },
]

export default function Recruit() {
  return (
    <div>
      {/* Red flags */}
      <div style={{ background: '#2d080899', border: '1px solid #f8514944', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#f85149', marginBottom: 8 }}>🚩 Red Flags — Ne jamais signer</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { name: 'Friable', reason: 'Pression 1 garanti = fantôme en match' },
            { name: 'Indolent / Occasionnel', reason: 'Pro 1 garanti = ne développera jamais' },
            { name: 'En manque de confiance', reason: 'Pression 2-3 garanti' },
            { name: 'Style Direct', reason: 'Pression et Gros Matchs très bas garantis' },
            { name: 'Style Court-feu / Volatile', reason: 'Tempérament minimal garanti = cartons et suspensions' },
          ].map(rf => (
            <div key={rf.name} style={{ display: 'flex', gap: 8, fontSize: 11 }}>
              <span style={{ color: '#f85149', flexShrink: 0 }}>•</span>
              <span style={{ color: '#f85149', fontWeight: 700, flexShrink: 0 }}>{rf.name}</span>
              <span style={{ color: '#7d8590' }}>{rf.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profils */}
      {PROFILES.map(profile => {
        const list = PERSONALITIES
          .filter(profile.filter)
          .sort((a, b) => b[profile.sortKey] - a[profile.sortKey])
          .slice(0, 8)

        return (
          <div key={profile.id} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#e6edf3', marginBottom: 6 }}>
              {profile.icon} {profile.label}
              <span style={{ fontSize: 11, color: '#7d8590', fontWeight: 400, marginLeft: 8 }}>{profile.desc}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {list.map(p => {
                const cfg = TIER_CONFIG[p.tier]
                return (
                  <div key={p.id} style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}33`, borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#e6edf3' }}>{p.name}</div>
                      <div style={{ fontSize: 9, color: '#7d8590' }}>Dev {p.dev} · Pres {p.pres}</div>
                    </div>
                    <Badge tier={p.tier} />
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: 10, color: '#58a6ff', background: '#0c1a3a', border: '1px solid #1e40af33', borderRadius: 6, padding: '6px 10px' }}>
              💡 {profile.tip}
            </div>
          </div>
        )
      })}
    </div>
  )
}
