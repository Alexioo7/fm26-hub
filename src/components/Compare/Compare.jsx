import { useState } from 'react'
import { PERSONALITIES, ATTRS, TIER_CONFIG } from '../../data/personalities'
import Badge from '../ui/Badge'
import Tooltip from '../ui/Tooltip'
import { AttrIcon } from '../ui/icons'

export default function Compare() {
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')

  const left = PERSONALITIES.find(p => p.id === leftId)
  const right = PERSONALITIES.find(p => p.id === rightId)

  const SelectBox = ({ value, onChange, label }) => (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 10, color: '#7d8590', display: 'block', marginBottom: 4 }}>{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 12 }}
      >
        <option value="">— Choisir —</option>
        {['S','A','B','C','D'].map(tier => (
          <optgroup key={tier} label={`Tier ${tier}`}>
            {PERSONALITIES.filter(p => p.tier === tier).map(p => (
              <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <SelectBox value={leftId} onChange={setLeftId} label="Personnalité A" />
        <SelectBox value={rightId} onChange={setRightId} label="Personnalité B" />
      </div>

      {left && right && (
        <>
          {/* Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, marginBottom: 10 }}>
            <div style={{ background: '#161b22', border: `1px solid ${TIER_CONFIG[left.tier].color}44`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{left.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#e6edf3' }}>{left.name}</div>
              <Badge tier={left.tier} />
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#3fb950' }}>Dev {left.dev}</span>
                <span style={{ fontSize: 10, color: '#58a6ff' }}>Pres {left.pres}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 16, color: '#484f58', fontWeight: 800 }}>VS</div>
            <div style={{ background: '#161b22', border: `1px solid ${TIER_CONFIG[right.tier].color}44`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{right.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#e6edf3' }}>{right.name}</div>
              <Badge tier={right.tier} />
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#3fb950' }}>Dev {right.dev}</span>
                <span style={{ fontSize: 10, color: '#58a6ff' }}>Pres {right.pres}</span>
              </div>
            </div>
          </div>

          {/* Attr comparison */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
            {ATTRS.map((a, i) => {
              const lAvg = left.avg?.[a.key] ?? Math.round((left.attrs[a.key][0] + left.attrs[a.key][1]) / 2)
              const rAvg = right.avg?.[a.key] ?? Math.round((right.attrs[a.key][0] + right.attrs[a.key][1]) / 2)
              const lWins = lAvg > rAvg
              const rWins = rAvg > lAvg
              const lColor = lWins ? '#3fb950' : rWins ? '#f85149' : '#7d8590'
              const rColor = rWins ? '#3fb950' : lWins ? '#f85149' : '#7d8590'
              return (
                <div key={a.key} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '8px 14px', borderBottom: i < ATTRS.length - 1 ? '1px solid #21262d33' : 'none', background: i % 2 === 0 ? 'transparent' : '#ffffff04' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: lWins ? 700 : 400, fontSize: 13, color: lColor }}>{lAvg}</span>
                    <span style={{ fontSize: 10, color: '#484f58', marginLeft: 4 }}>({left.attrs[a.key][0]}–{left.attrs[a.key][1]})</span>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0 10px', minWidth: 110 }}>
                    <div style={{ fontSize: 9, color: '#484f58', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <AttrIcon attrKey={a.key} size={11} color="#7d8590" />
                      <Tooltip content={a.info}><span className="has-tip">{a.label}</span></Tooltip>
                    </div>
                    {lWins && <div style={{ fontSize: 9, color: '#3fb950', marginTop: 2 }}>◄</div>}
                    {rWins && <div style={{ fontSize: 9, color: '#3fb950', marginTop: 2 }}>►</div>}
                    {!lWins && !rWins && <div style={{ fontSize: 9, color: '#484f58', marginTop: 2 }}>═</div>}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 10, color: '#484f58', marginRight: 4 }}>({right.attrs[a.key][0]}–{right.attrs[a.key][1]})</span>
                    <span style={{ fontWeight: rWins ? 700 : 400, fontSize: 13, color: rColor }}>{rAvg}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {(!left || !right) && (
        <div style={{ textAlign: 'center', color: '#484f58', padding: '40px 0', fontSize: 13 }}>
          Sélectionne deux personnalités pour les comparer
        </div>
      )}
    </div>
  )
}
