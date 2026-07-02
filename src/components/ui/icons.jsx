import {
  ClipboardList, Gem, Trophy, Target, Flame, Snowflake, Handshake,
  Shield, Crown, Bandage,
} from 'lucide-react'

// Icônes SVG des attributs cachés (remplacent les emojis)
export const ATTR_ICONS = {
  professionalism: ClipboardList,
  pressure: Gem,
  importantMatches: Trophy,
  ambition: Target,
  determination: Flame,
  temperament: Snowflake,
  sportsmanship: Handshake,
  loyalty: Shield,
  leadership: Crown,
  injuryProneness: Bandage,
}

export function AttrIcon({ attrKey, size = 13, color = 'currentColor', style }) {
  const I = ATTR_ICONS[attrKey]
  if (!I) return null
  return (
    <I
      size={size}
      color={color}
      strokeWidth={2}
      aria-hidden="true"
      style={{ flexShrink: 0, verticalAlign: '-2px', display: 'inline-block', ...style }}
    />
  )
}
