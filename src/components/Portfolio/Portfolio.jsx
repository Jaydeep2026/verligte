import { useCallback, useEffect, useRef, useState } from 'react'
import useInView from '../../hooks/useInView'
import { PROJECTS } from './portfolioData'
import './Portfolio.css'

const LEAVE_MS = 900

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14h6v6M10 14l-7 7M20 10h-6V4M14 10l7-7" />
    </svg>
  )
}

function Slide({ project, state, open, onToggle, onPause }) {
  return (
    <div className={`pf__slide is-${state}`}>
      <button
        type="button"
        className="pf__media"
        onClick={onToggle}
        onMouseEnter={() => onPause(true)}
        onMouseLeave={() => onPause(false)}
        aria-label={open ? `Close ${project.name} case study` : `Open ${project.name} case study`}
      >
        <img className="pf__img" src={project.image} alt="" draggable="false" />
        <span className="pf__shade" />
      </button>

      <h3 className="pf__title" aria-label={project.name}>
        {[...project.name.toUpperCase()].map((letter, i) => (
          <span key={i} style={{ '--i': i }} aria-hidden="true">
            {letter === ' ' ? '\u00a0' : letter}
          </span>
        ))}
      </h3>

      <div className="pf__meta pf__meta--left">
        <span>{project.name}</span>
        <span>{project.year}</span>
        <span>{project.place}</span>
      </div>

      <div className="pf__meta pf__meta--right">
        <span className="pf__meta-head">{project.services[0]}</span>
        <div className="pf__meta-grid">
          <div>
            <span>Client</span>
            <span>{project.client}</span>
          </div>
          <div className="is-right">
            <span>{project.services[1]}</span>
            <span>{project.services[2]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [ref, seen] = useInView(0.25)
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(null)
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const current = useRef(0)
  const timer = useRef(null)

  const goTo = useCallback(target => {
    const next = (target + PROJECTS.length) % PROJECTS.length
    if (next === current.current) return
    setLeaving(current.current)
    current.current = next
    setIndex(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLeaving(null), LEAVE_MS)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = event => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === 'ArrowRight') goTo(current.current + 1)
      if (event.key === 'ArrowLeft') goTo(current.current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, goTo])

  const toggle = () => setOpen(value => !value)
  const rendered = [leaving, index].filter(value => value !== null)
  const classes = ['pf', open && 'is-open', paused && 'is-paused'].filter(Boolean).join(' ')

  return (
    <section ref={ref} className={classes} id="work" aria-label="Selected work">
      <div className="pf__top">
        <span className="pf__label">Project</span>
        <span className="pf__idx">Portfolio #{index + 1}</span>
      </div>

      {seen &&
        rendered.map(i => (
          <Slide
            key={PROJECTS[i].id}
            project={PROJECTS[i]}
            state={i === index ? 'active' : 'leaving'}
            open={open}
            onToggle={toggle}
            onPause={setPaused}
          />
        ))}

      <div className="pf__dots">
        {PROJECTS.map((project, i) => (
          <button
            key={project.id}
            type="button"
            className={`pf__dot ${i === index ? 'is-on' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Show ${project.name}`}
            aria-current={i === index}
          >
            {i === index && (
              <i onAnimationEnd={event => event.animationName === 'pfFill' && goTo(index + 1)} />
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pf__toggle"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Close case study' : 'Open case study'}
      >
        {open ? <CollapseIcon /> : <ExpandIcon />}
      </button>
    </section>
  )
}
