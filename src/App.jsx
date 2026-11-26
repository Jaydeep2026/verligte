import { useState } from 'react'
import './App.css'
import Preloader from './components/Preloader/Preloader'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Manifesto from './components/Manifesto/Manifesto'
import Portfolio from './components/Portfolio/Portfolio'
import Services from './components/Services/Services'
import Gallery from './components/Gallery/Gallery'
import Statement from './components/Statement/Statement'
import Principles from './components/Principles/Principles'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

export default function App() {
  const [stage, setStage] = useState(0)   // 0 = preloader playing, 1 = exiting (homepage fades in), 2 = finished
  return (
    <>
      {stage < 2 && <Preloader onExit={() => setStage(s => Math.max(s, 1))} onComplete={() => setStage(2)} />}
      <div className={`site ${stage >= 1 ? 'is-ready' : ''}`}>
        <Header ready={stage >= 2} />
        <main>
          <Hero revealed={stage >= 1} /><Manifesto /><Portfolio /><Services />
          <Gallery /><Statement /><Principles /><Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
