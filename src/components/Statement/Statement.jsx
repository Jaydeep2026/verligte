import './Statement.css'
export default function Statement() {
  return (<section className="stm">
    <h2 className="display stm__claim">Your brand deserves a bold presence online</h2>
    <div className="stm__stage" role="img" aria-label="A website being built on screen">
      <div className="stm__win">
        <div className="stm__bar"><i /><i /><i /><span className="mono">yourbrand.com</span></div>
        <div className="stm__page">
          <span className="stm__line" style={{ '--w': '70%', height: 28 }} />
          <span className="stm__line" style={{ '--w': '45%', height: 28, animationDelay: '.3s' }} />
          <span className="stm__hero" />
          <span className="stm__line" style={{ '--w': '85%', animationDelay: '.6s' }} />
          <span className="stm__line" style={{ '--w': '60%', animationDelay: '.9s' }} />
          <span className="stm__btn" />
        </div>
      </div>
    </div>
  </section>)
}
