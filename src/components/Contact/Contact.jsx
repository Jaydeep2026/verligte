import './Contact.css'
export default function Contact() {
  return (<section className="con" id="contact">
    {/* <div className="con__banner" role="img" aria-label="Studio lit in orange" /> */}
    <div className="con__grid">
      <address className="con__info">
        <a href="tel:+911234567890">+91 123 456 7890</a>
        <a href="mailto:hello@verligte.com">hello@verligte.com</a>
        <span className="mono">Studio 27, Linking Road<br />Bandra West, Mumbai</span>
      </address>
      <a href="mailto:hello@verligte.com" className="display con__cta">Say hey <span>↗</span></a>
    </div>
  </section>)
}
