import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Logo from '../Logo/Logo'
import { PIECES } from '../Logo/logoPieces'
import './Preloader.css'

let hasPlayed = false

const DOT = PIECES.find(piece => piece.kind === 'dot')

export default function Preloader({ onExit, onComplete }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (hasPlayed) {
      onExit()
      onComplete()
      return
    }

    const html = document.documentElement
    html.classList.add('pl-lock')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const background = q('.pl__bg')
      const logo = q('.pl__logo')[0]
      const letters = q('.logo__letter svg')
      const tagline = q('.logo__tag svg')
      const dot = q('.logo__dot')
      const glow = q('.logo__glow')
      const progress = q('.pl__progress')
      const bar = q('.pl__progress i')

      const finish = () => {
        hasPlayed = true
        html.classList.remove('pl-lock')
        onComplete()
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish })

      if (reduce) {
        timeline
          .to({}, { duration: 0.6 })
          .add(onExit)
          .to(background, { opacity: 0, duration: 0.4, ease: 'none' })
        return
      }

      const flight = () => {
        const target = document.querySelector('.hdr__logo .logo')
        if (!target) return { dx: 0, dy: 0, scale: 1 }
        const from = logo.getBoundingClientRect()
        const to = target.getBoundingClientRect()
        return {
          dx: to.left + to.width / 2 - (from.left + from.width / 2),
          dy: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
        }
      }

      const dotBox = dot[0].getBoundingClientRect()
      const startAboveScreen = -((dotBox.top + dotBox.height) / dotBox.height) * 100

      gsap.set(background, { opacity: 0 })
      gsap.set([...letters, ...tagline], { yPercent: 104 })
      gsap.set(bar, { scaleX: 0 })
      gsap.set(dot, { yPercent: startAboveScreen, transformOrigin: '50% 100%' })

      timeline
        .to(background, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 0)
        .to(bar, { scaleX: 1, duration: 3.4, ease: 'power1.inOut' }, 0)

        .to(letters, { yPercent: 0, duration: 0.75, ease: 'power4.out', stagger: 0.08 }, 0.6)

        .to(dot, { yPercent: 0, duration: 0.7, ease: 'power2.in' }, 1.95)
        .to(glow, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 2.1)
        .to(glow, { opacity: 0, duration: 0.45, ease: 'power1.in' }, 2.7)
        .to(dot, { scaleX: 1.14, scaleY: 0.86, duration: 0.09, ease: 'power1.out' }, 2.65)
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, 2.74)

        .to(tagline, { yPercent: 0, duration: 0.7 }, 2.8)

        .set(root.current, { pointerEvents: 'none' }, 3.6)
        .add(onExit, 3.6)
        .to(progress, { opacity: 0, duration: 0.3 }, 3.6)
        .to(background, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 3.6)
        .to(logo, {
          x: () => flight().dx,
          y: () => flight().dy,
          scale: () => flight().scale,
          duration: 1.1,
          ease: 'power3.inOut',
        }, 3.6)
    }, root)

    return () => {
      ctx.revert()
      html.classList.remove('pl-lock')
    }
  }, [])

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl__bg" />
      <div className="pl__inner">
        <Logo className="pl__logo" />
        <div className="pl__progress">
          <i style={{ background: DOT.fill }} />
        </div>
      </div>
    </div>
  )
}