import './Services.css'
const S = [
  { t: 'Website development', tags: ['React', 'Next.js', 'WordPress'], d: 'Fast, secure sites coded to your brief and built to grow with your business.' },
  { t: 'E-commerce', tags: ['Shopify', 'WooCommerce', 'Payments'], d: 'Online stores with smooth checkout, inventory sync and payment setup.' },
  { t: 'UI/UX design', tags: ['Wireframes', 'Prototypes', 'Design system'], d: 'Interfaces tested with real users so visitors find what they need quickly.' },
  { t: 'Support & SEO', tags: ['Hosting', 'Speed', 'Technical SEO'], d: 'Updates, backups and performance tuning after launch, so the site keeps working for you.' },
]
export default function Services() {
  return (<section className="svc" id="services">
    <h2 className="display svc__head">Our<br />services</h2>
    <ul className="svc__list">{S.map(s => (
      <li key={s.t} className="svc__row">
        <h3 className="svc__name">{s.t}</h3>
        <div className="svc__tags">{s.tags.map(t => <span key={t} className="pill">{t}</span>)}</div>
        <p className="svc__desc">{s.d}</p>
      </li>))}
    </ul>
  </section>)
}
