import { useEffect, useRef } from 'react'
import { LP_CTA, LP_HERO, VOICES, WEEK } from '../data/lp'
import { HERO } from '../data/site'
import { LP_REVIEWS } from '../data/lpv2'
import { AgeScene } from '../components/lp2/AgeScene'
import { CoachSpec } from '../components/lp2/CoachSpec'
import { FirstClass } from '../components/lp2/FirstClass'
import { Proof } from '../components/lp2/Proof'
import { SameHour } from '../components/lp2/SameHour'
import { LpClosing, LpFaq } from '../components/lp/Closing'
import { Hero } from '../components/sections/Hero'
import { Reviews } from '../components/sections/Reviews'
import { Schedule } from '../components/sections/Schedule'

/**
 * /lp · the paid-traffic landing page, rebuilt from zero (Adryan, 16/11/2026) on the site's design system and
 * at its level: the approved copy of /free-class, told by scenes instead of blocks. Surfaces top to bottom:
 * the hero card on white · white (the age scene) · white (the four steps) · white (the coach) · white (the proof)
 * · white (the site's reviews and schedule, Adryan 16/11: same design as the site) · white (same hour) · white (FAQ) · photo into the footer's ink.
 * The open points (src/data/lp.ts PENDING) stay off the page; `?pend=1` shows them for review.
 */
export function LpPage() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (new URLSearchParams(location.search).has('pend')) ref.current?.classList.add('show-pend')
  }, [])
  return (
    <div className="lp2" ref={ref}>
      <Hero home className="lph" eyebrow={HERO.eyebrow} title={LP_HERO.title} sub={<><span className="lph__long">{LP_HERO.sub}</span><span className="lph__short">{LP_HERO.subShort}</span></>} photo={LP_HERO.photo} pos="50% 40%" cta={LP_CTA} proof={null} />
      <AgeScene />
      <FirstClass />
      <CoachSpec />
      <Proof />
      <Reviews title={VOICES.title} items={LP_REVIEWS} />
      <Schedule title={WEEK.title} />
      <SameHour />
      <LpFaq />
      <LpClosing />
    </div>
  )
}
