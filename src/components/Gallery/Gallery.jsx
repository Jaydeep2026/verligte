import './Gallery.css'
const C = [
  ['React & Next.js', 'Fast, SEO-ready front ends built for performance.', 'TypeScript · Vercel'],
  ['WordPress & CMS', 'Sites your team can edit without calling a developer.', 'WordPress · Sanity'],
  ['Shopify stores', 'Storefronts that load fast and convert visitors into buyers.', 'Shopify · Liquid'],
  ['Web apps & dashboards', 'Custom portals and tools with secure logins and clean data views.', 'Node · PostgreSQL'],
  ['API integrations', 'Connect payments, CRMs and booking tools to your site.', 'REST · Stripe · Zapier'],
  ['Speed & SEO', 'Core Web Vitals, accessibility and search basics done properly.', 'Lighthouse · GA4'],
]
export default function Gallery() {
  return (<section className="gal" aria-label="What we build">
    <h2 className="display gal__head">What we build</h2>
    <div className="gal__view"><ul className="gal__track">
      {[...C, ...C].map(([t, d, s], i) => (
        <li key={i} className="gal__card" aria-hidden={i >= C.length}>
          <span className="mono gal__stack">{s}</span>
          <div><h3>{t}</h3><p>{d}</p></div>
        </li>))}
    </ul></div>
  </section>)
}
