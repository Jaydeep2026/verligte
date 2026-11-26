import Logo from '../Logo/Logo'
import './Footer.css'

const COLUMNS = [
  ['Site map', ['Work', 'Services', 'Principles', 'Contact']],
  ['Utility', ['Privacy', 'Terms', 'Careers']],
  ['Social', ['Instagram', 'Behance', 'LinkedIn']],
]

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__main">
        <div className="ftr__brand">
          <Logo className="ftr__logo" />
          <p>Websites designed and developed for brands that want to be remembered.</p>
          <a href="mailto:hello@verligte.com" className="ftr__btn">Start a project ↗</a>
        </div>

        {COLUMNS.map(([title, links]) => (
          <div key={title} className="ftr__col">
            <h4 className="mono">{title}</h4>
            {links.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
            ))}
          </div>
        ))}
      </div>

      <div className="ftr__bar mono">
        <span>© 2026 verligte</span>
        <span>Mumbai, India</span>
        <a href="#top">Back to top ↑</a>
      </div>

      {/* <div className="ftr__mark" aria-hidden="true">
        <Logo tagline={false} />
      </div> */}
    </footer>
  )
}
