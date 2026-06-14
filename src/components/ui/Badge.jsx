import { TIER_CONFIG } from '../../data/personalities'

export default function Badge({ tier, size = 'sm' }) {
  const cfg = TIER_CONFIG[tier]
  const pad = size === 'sm' ? '1px 7px' : '2px 10px'
  const fs = size === 'sm' ? '11px' : '13px'
  return (
    <span style={{
      background: cfg.color,
      color: '#000',
      borderRadius: '4px',
      padding: pad,
      fontWeight: 800,
      fontSize: fs,
      letterSpacing: '0.05em',
      flexShrink: 0,
    }}>
      {tier}
    </span>
  )
}