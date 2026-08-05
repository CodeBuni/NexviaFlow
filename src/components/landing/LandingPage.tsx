import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from './Hero'
import { ComoFunciona } from './ComoFunciona'
import { MetricasProva } from './MetricasProva'
import { Planos } from './Planos'
import { FAQ } from './FAQ'
import { CtaFinal } from './CtaFinal'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ComoFunciona />
        <MetricasProva />
        <Planos />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
