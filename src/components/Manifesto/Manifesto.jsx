import useInView from '../../hooks/useInView'
import './Manifesto.css'
export default function Manifesto() {
  const [ref, seen] = useInView(0.35)
  return (<section className="mani" ref={ref}>
    <div className={`mani__box ${seen ? 'is-open' : ''}`}>
      <h2 className="display mani__title">We are<br />going bold</h2>
      <div className="mani__copy">
        <p>A website should be clear before it is clever. We start with what your business needs people to do, then strip everything that gets in the way.</p>
        <p>Confident simplicity wins attention and keeps it. Every page we build has one purpose and a design that makes it obvious.</p>
      </div>
    </div>
  </section>)
}
