import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Logo from '../Logo/Logo'
import './Hero.css'

export default function Hero({ revealed }) {
  const root = useRef(null)
  const timeline = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const letters = q('.logo__letter svg')
      const tagline = q('.logo__tag svg')
      const dot = q('.logo__dot')

      gsap.set([...letters, ...tagline], { yPercent: 104 })
      gsap.set(dot, { opacity: 0 })

      timeline.current = gsap
        .timeline({ paused: true })
        .to(letters, { yPercent: 0, duration: 0.85, ease: 'power4.out', stagger: 0.08 }, 0.1)
        .fromTo(
          dot,
          { yPercent: -420, opacity: 0, scale: 0.5 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.in' },
          0.95
        )
        .to(dot, { scaleX: 1.14, scaleY: 0.86, transformOrigin: '50% 100%', duration: 0.09, ease: 'power1.out' }, 1.65)
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, 1.74)
        .to(tagline, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, 1.7)
    }, root)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (revealed) timeline.current?.play()
  }, [revealed])

  return (
    <section ref={root} className={`hero ${revealed ? 'is-in' : ''}`} id="top">
      <div className="hero__bg">
        <div className="hero__haze" />
      </div>

      <p className="hero__intro mono">
        We design and build websites
        <br />
        for brands that want to be seen.
        <br />
        Based in Mumbai, working worldwide.
      </p>

      <h1 className="hero__word">
        <Logo className="hero__logo" draggable />
      </h1>

      <span className="hero__badge mono"># Web design &amp; development</span>
    </section>
  )
}
