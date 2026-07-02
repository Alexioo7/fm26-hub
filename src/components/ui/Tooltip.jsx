import { useState, useRef, useCallback } from 'react'

// Tooltip accessible : survol + focus clavier + tap mobile.
// Position fixed pour ne pas être coupé par les conteneurs overflow (tableaux).
export default function Tooltip({ content, children, width = 250 }) {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)

  const open = useCallback(() => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const half = width / 2 + 8
    const x = Math.min(Math.max(r.left + r.width / 2, half), window.innerWidth - half)
    setPos({ x, top: r.top })
  }, [width])

  const close = () => setPos(null)

  return (
    <span
      ref={ref}
      tabIndex={0}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      onClick={() => (pos ? close() : open())}
      onKeyDown={e => { if (e.key === 'Escape') close() }}
      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
    >
      {children}
      {pos && (
        <span
          role="tooltip"
          style={{
            position: 'fixed',
            left: pos.x,
            bottom: window.innerHeight - pos.top + 8,
            transform: 'translateX(-50%)',
            width,
            maxWidth: 'calc(100vw - 16px)',
            background: '#1c2128',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: '9px 11px',
            fontSize: 11,
            lineHeight: 1.55,
            color: '#c9d1d9',
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            animation: 'tooltip-in 0.15s ease-out',
            whiteSpace: 'normal',
            textAlign: 'left',
            fontWeight: 400,
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
