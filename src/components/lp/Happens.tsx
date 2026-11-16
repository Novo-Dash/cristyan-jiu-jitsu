import { useRef } from 'react'
import { HAPPENS, LP_CTA } from '../../data/lp'
import { SITE } from '../../data/site'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Pending } from '../ui/Pending'
import { TitleText } from '../ui/Title'

/**
 * "Here's exactly what happens": four steps from the phone to the mat on one line. The line fills as you
 * read down the section (scrubbed, never pinned) and each diamond turns red when the fill reaches it: the
 * whole path is short and you can see the end of it. Phones: the same line, vertical.
 */
export function Happens() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    rise(r.querySelectorAll('.hp__step'), r.querySelector('.hp__steps')!, { stagger: 0.1 })
    const steps = [...r.querySelectorAll<HTMLElement>('.hp__step')]
    gsap.matchMedia().add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)' }, (ctx) => {
      const wide = ctx.conditions!.wide
      gsap.fromTo(r.querySelector('.hp__fill'), wide ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 }, {
        [wide ? 'scaleX' : 'scaleY']: 1, ease: 'none',
        scrollTrigger: {
          trigger: r.querySelector('.hp__steps'), start: 'top 75%', end: wide ? 'bottom 55%' : 'bottom 65%', scrub: 0.6,
          onUpdate: (st) => steps.forEach((s, i) => s.classList.toggle('on', st.progress >= i / (steps.length - 1) - 0.02)),
        },
      })
    })
  }, { scope: root })
  return (
    <section className="sec hp" data-nav="dark" aria-labelledby="hp-h" ref={root}>
      <div className="shell">
        <div className="head"><h2 className="t t-1" id="hp-h"><TitleText title={HAPPENS.title} /></h2></div>
        <div className="hp__steps">
          <span className="hp__line" aria-hidden="true"><i className="hp__fill" /></span>
          <ol className="hp__list" role="list">
            {HAPPENS.steps.map((s, i) => (
              <li key={s.t} className="hp__step">
                <span className="hp__dot" aria-hidden="true"><b>{String(i + 1).padStart(2, '0')}</b></span>
                <p className="hp__t"><span className="sr">Step {i + 1}. </span>{s.t}</p>
                {s.d ? <p className="hp__d">{s.d}</p> : null}
                {s.pending ? <Pending dark>{s.pending}</Pending> : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="hp__acts">
          <Cta label={LP_CTA} />
          <p className="hp__talk">{HAPPENS.talk} <a href={SITE.phone.tel}><Icon name="phone" />{SITE.phone.display}</a></p>
        </div>
      </div>
    </section>
  )
}
