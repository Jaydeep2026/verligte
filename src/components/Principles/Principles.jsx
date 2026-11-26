import './Principles.css'
const P = [['direction', 'We agree where the site is going before we draw a pixel.'], ['purpose', 'Every page has one job and the layout makes it obvious.'], ['imagination', 'Ideas that make your brand feel unlike anyone else’s.'], ['identity', 'Your logo, colour and type working as one system.']]
export default function Principles() {
  return (<section className="pri" id="principles">
    <h2 className="display pri__claim">Crafting bold vision that connects, converts and inspires.</h2>
    <div className="pri__list">{P.map(([t, d]) => <div key={t} className="pri__item"><h3 className="mono pri__t">// {t}</h3><p>{d}</p></div>)}</div>
  </section>)
}
