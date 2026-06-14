import { MEDIA_STYLES } from '../../data/mediaStyles'

export default function MediaTag({ name }) {
  const ms = MEDIA_STYLES.find(s => s.name === name)
  const isGood = ms && (ms.grade === 'S' || ms.grade === 'A')
  return (
    <span style={{
      display: 'inline-block',
      background: isGood ? `${ms.color}18` : '#21262d',
      border: `1px solid ${isGood ? ms.color + '55' : '#30363d'}`,
      color: isGood ? ms.color : '#7d8590',
      borderRadius: 4,
      padding: '1px 6px',
      fontSize: 10,
      margin: 1,
      fontWeight: isGood ? 600 : 400,
    }}>
      {name}
    </span>
  )
}