import { useRef } from 'react'
import gsap from 'gsap'
import { STAGE, PIECES } from './logoPieces'
import './Logo.css'

const RETURN_ON_RELEASE = true

const LETTERS = PIECES.filter(piece => piece.kind === 'letter')
const DOT = PIECES.find(piece => piece.kind === 'dot')
const TAG = PIECES.find(piece => piece.kind === 'tag')

const percent = (value, total) => `${(value / total) * 100}%`

const frame = piece => ({
  left: percent(piece.x, STAGE.w),
  top: percent(piece.y, STAGE.h),
  width: percent(piece.w, STAGE.w),
  height: percent(piece.h, STAGE.h),
})

function Shape({ piece }) {
  return (
    <svg viewBox={`0 0 ${piece.w} ${piece.h}`} preserveAspectRatio="none" focusable="false">
      <path d={piece.d} fill={piece.fill} fillRule="evenodd" />
    </svg>
  )
}

export default function Logo({ tagline = true, draggable = false, className = '' }) {
  const dotRef = useRef(null)
  const grab = useRef(null)

  const handleDown = event => {
    if (!draggable) return
    const dot = dotRef.current
    event.preventDefault()
    dot.setPointerCapture(event.pointerId)
    gsap.killTweensOf(dot, 'x,y')
    grab.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: gsap.getProperty(dot, 'x'),
      y: gsap.getProperty(dot, 'y'),
    }
    dot.classList.add('is-grabbed')
    gsap.to(dot, { scale: 1.25, duration: 0.3, ease: 'power3.out' })
  }

  const handleMove = event => {
    const start = grab.current
    if (!start) return
    gsap.to(dotRef.current, {
      x: start.x + event.clientX - start.pointerX,
      y: start.y + event.clientY - start.pointerY,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const handleUp = () => {
    if (!grab.current) return
    const dot = dotRef.current
    grab.current = null
    dot.classList.remove('is-grabbed')
    gsap.to(dot, { scale: 1, duration: 0.4, ease: 'power3.out' })
    if (RETURN_ON_RELEASE) {
      gsap.to(dot, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' })
    }
  }

  const classes = ['logo', draggable && 'is-draggable', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={{ aspectRatio: `${STAGE.w} / ${STAGE.h}` }}
      role="img"
      aria-label="verligte, just beautiful websites"
    >
      {LETTERS.map(piece => (
        <div key={piece.id} className="logo__piece logo__letter" style={frame(piece)}>
          <Shape piece={piece} />
        </div>
      ))}

      {tagline && (
        <div className="logo__piece logo__tag" style={frame(TAG)}>
          <Shape piece={TAG} />
        </div>
      )}

      <div
        ref={dotRef}
        className="logo__dot"
        style={frame(DOT)}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <span
          className="logo__glow"
          style={{ background: `radial-gradient(circle, ${DOT.fill}8c, ${DOT.fill}00 65%)` }}
        />
        <Shape piece={DOT} />
      </div>
    </div>
  )
}
