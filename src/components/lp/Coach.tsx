import { useRef } from 'react'
import { COACH } from '../../data/lp'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Mark } from '../ui/Mark'
import { Photo } from '../ui/Photo'
import { Tag } from '../ui/Title'

const MARKS = [-2, -1, 0, 1, 2]

/**
 * The coach, on the site's professor card (same white card, red panel with the logo's marks, Cristyan standing
 * on its bottom edge, the button on the edge): here the card carries the LP's argument, the title on the left
 * and the bio with the three numbers on the right. Scrolling, the panel rises and he climbs onto it.
 */
export function Coach() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    rise(r.querySelectorAll('.lpc__stats > div'), r.querySelector('.lpc__stats')!, { stagger: 0.08, start: 'top 85%' })
    gsap.timeline({ scrollTrigger: { trigger: r.querySelector('.pf__stage'), start: 'top 95%', end: 'top 30%', scrub: 0.7 } })
      .fromTo(r.querySelector('.pf__panel'), { scaleY: 0.55, opacity: 0 }, { scaleY: 1, opacity: 1, ease: 'power2.out' }, 0)
      .fromTo(r.querySelectorAll('.pf__marks svg'), { scale: 0.8 }, { scale: 1, ease: 'power2.out', stagger: { each: 0.04, from: 'center' } }, 0)
      .fromTo(r.querySelector('.pf__me'), { yPercent: 22 }, { yPercent: 0, ease: 'power2.out' }, 0.1)
  }, { scope: root })
  return (
    <section className="sec pf lpc" id="coach" aria-labelledby="lpc-h" ref={root}>
      <div className="shell">
        <div className="pf__card">
          <div className="pf__top">
            <div>
              <Tag>{COACH.eyebrow}</Tag>
              <h2 className="t t-1 lpc__h" id="lpc-h">{COACH.title.a}<span className="hl">{COACH.title.b}</span>{COACH.title.c}</h2>
              <dl className="lpc__stats">
                {COACH.stats.map((s) => <div key={s.l}><dt>{s.l}</dt><dd>{s.n}</dd></div>)}
              </dl>
            </div>
            <div className="pf__r">
              <p className="lpc__body">{COACH.body}</p>
            </div>
          </div>
          <div className="pf__stage">
            <div className="pf__panel" data-nav="dark" aria-hidden="true"><div className="pf__marks">{MARKS.map((i) => <Mark key={i} />)}</div></div>
            <div className="pf__me"><Photo photo={COACH.cutout} sizes="(max-width: 899px) 76vw, 400px" /></div>
          </div>
          <div className="pf__acts"><Cta label={COACH.cta} /></div>
        </div>
      </div>
    </section>
  )
}
