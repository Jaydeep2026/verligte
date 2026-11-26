import { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import './Header.css'
export default function Header({ ready }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (ready) document.body.style.overflow = open ? 'hidden' : '' }, [open, ready])
  return (<>
    <header className={`hdr ${open ? 'is-menu' : ''}`}>
      <button className="hdr__burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /></button>
      <a href="#top" className={`hdr__logo ${ready ? 'is-ready' : ''}`} onClick={() => setOpen(false)}><Logo /></a>
    </header>
    <nav className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open} onClick={() => setOpen(false)}>
      {['Work', 'Services', 'Principles', 'Contact'].map(l => <a key={l} href={`#${l.toLowerCase()}`} tabIndex={open ? 0 : -1}>{l}</a>)}
      <span className="mono menu__foot">hello@verligte.com</span>
    </nav>
  </>)
}
