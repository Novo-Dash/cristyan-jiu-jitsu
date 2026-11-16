import { useRef, useState } from 'react'
import { HAPPENS, LP_CTA } from '../../data/lp'
import { STEPS, STEP_OBJ } from '../../data/lpv2'
import { SITE } from '../../data/site'
import { gsap, lines, rise, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { FLAT, motionOK, SCENE } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Mark'
import { Photo } from '../ui/Photo'
import { TitleText } from '../ui/Title'

const pad = (n: number) => String(n).padStart(2, '0')

/** the clothes, drawn as a flat-lay in square line art like the brand: seams, hems and a waistband, not just outlines */
const SHIRT = (
  <svg viewBox="0 0 100 100"><path d="M36 10l14 8 14-8 26 15-10 18-10-6v55H30V37l-10 6-10-18z" /><path d="M36 10c2 8 8 12 14 12s12-4 14-12" /><path d="M30 37v-6M70 37v-6" className="fo__seam" /><path d="M30 86h40" className="fo__seam" /></svg>
)
const SHORTS = (
  <svg viewBox="0 0 100 100"><path d="M18 14h64l8 70H58l-8-34-8 34H10z" /><path d="M18 26h64" /><path d="M46 26v7M54 26v7" className="fo__seam" /><path d="M14 76h26M60 76h26" className="fo__seam" /></svg>
)
const JEANS = (
  <svg viewBox="0 0 100 100"><path d="M22 10h56l6 80H60l-10-46-10 46H16z" /><path d="M22 20h56" /><path d="M50 20v20" /><path d="M48 24l4 0M48 29h4M48 34h4" className="fo__seam" /><path d="M24 22c4 8 12 10 18 8M76 22c-4 8-12 10-18 8" className="fo__seam" /></svg>
)
/** a pointer, the one cursor in the booking scene */
const CURSOR = <svg viewBox="0 0 24 24"><path d="M5 2l14 11-6 1.2 3.6 6.8-2.6 1.4-3.6-6.8L6 20z" /></svg>

/**
 * Each step's object: what the visitor will actually see or do at that point, drawn as a working scene
 * (Adryan, 16/11: "os elementos dos cards devem ser melhor trabalhados"). Every red in it is the card's red.
 */
function Obj({ kind }: { kind: (typeof STEPS)[number]['kind'] }) {
  const B = STEP_OBJ.book, T = STEP_OBJ.text
  if (kind === 'book') return (
    <div className="fo fo--book" aria-hidden="true">
      <div className="fo__sheet">
        <p className="fo__bar"><span className="fo__av"><Mark /></span><b>{LP_CTA}</b><span className="fo__prog"><i className="on" /><i /></span></p>
        <p className="fo__lbl"><Icon name="cal" />Pick a day</p>
        <div className="fo__days">{B.days.map((d, i) => <span key={d} className={i === B.day ? 'on' : ''}>{d}</span>)}</div>
        <p className="fo__lbl"><Icon name="clock" />Pick a class</p>
        <ul role="list">{B.rows.map((r, i) => <li key={r.name} className={i === 0 ? 'on' : ''}><time>{r.at}</time><span><b>{r.name}</b><small>{r.ages}</small></span><i>{i === 0 ? <><Icon name="check" /><span className="fo__tap" /><span className="fo__cur">{CURSOR}</span></> : null}</i></li>)}</ul>
        <p className="fo__next"><span>Continue</span><Icon name="arrow" /></p>
      </div>
    </div>
  )
  if (kind === 'text') return (
    <div className="fo fo--text" aria-hidden="true">
      <div className="fo__phone">
        <p className="fo__status"><b>4:12</b><span><i /><i /><i /><i /></span><em /></p>
        <p className="fo__ph"><Icon name="back" /><span className="fo__av"><Mark /></span><span><b>{T.from}</b><small>Text message · now</small></span></p>
        <div className="fo__thread">
          <p className="fo__bub">{T.body}</p>
          <div className="fo__att">
            <i><Photo photo={T.place} sizes="160px" alt="" /></i>
            <span><b>{T.addr.split(',')[0]}</b><small>{T.addr.split(',').slice(1).join(',').trim()}</small><em><Icon name="pin" />Directions</em></span>
          </div>
          <p className="fo__bub">{T.bring}</p>
        </div>
      </div>
    </div>
  )
  if (kind === 'wear') return (
    <div className="fo fo--wear" aria-hidden="true">
      <figure className="fo__item fo__item--shirt">{SHIRT}<figcaption><Icon name="check" />{STEP_OBJ.wear[0].t}</figcaption></figure>
      <figure className="fo__item fo__item--shorts">{SHORTS}<figcaption><Icon name="check" />{STEP_OBJ.wear[1].t}</figcaption></figure>
      <figure className="fo__item fo__item--no">{JEANS}<figcaption><Icon name="close" />{STEP_OBJ.wear[2].t}</figcaption></figure>
    </div>
  )
  return (
    <div className="fo fo--mat" aria-hidden="true">
      <Photo photo={STEP_OBJ.mat} sizes="(max-width: 899px) 90vw, 30vw" alt="" />
      <span className="fo__frame"><i /><i /><i /><i /></span>
      <p className="fo__chip">{STEP_OBJ.free}</p>
      <p className="fo__tag"><Mark />Professor Cristyan Martins</p>
    </div>
  )
}

/**
 * "Here's exactly what happens." From the phone to the mat in four steps, each one carried by the thing you
 * will actually meet: the class you pick, the text that confirms it, what you wear, the coach on the mat.
 * Desktop: the section holds while the scroll walks the four steps sideways, a red line filling underneath
 * (the path is short and you can see the end of it); the button waits at the end of the line. Phones and
 * reduced motion: the same four steps stacked, the line running down their left edge.
 */
export function FirstClass() {
  const root = useRef<HTMLElement>(null)
  const [at, setAt] = useState(0)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    const mm = gsap.matchMedia()
    mm.add(SCENE, () => {
      const stage = r.querySelector<HTMLElement>('.fc__stage')!, track = r.querySelector<HTMLElement>('.fc__track')!
      const dist = () => Math.max(0, track.scrollWidth - stage.clientWidth)
      const cards = [...r.querySelectorAll<HTMLElement>('.fc__step')]
      let last = -1
      gsap.timeline({
        scrollTrigger: {
          trigger: stage, start: 'top top', end: () => `+=${dist() + innerHeight * 0.25}`, scrub: 0.6, pin: stage, anticipatePin: 1, invalidateOnRefresh: true,
          // the red step is the card nearest the middle of the screen (the same on a 390 phone and a 2560 desktop)
          onUpdate: () => {
            const mid = innerWidth / 2
            let i = 0, bd = Infinity
            cards.forEach((c, k) => { const b = c.getBoundingClientRect(); const d = Math.abs(b.left + b.width / 2 - mid); if (d < bd) { bd = d; i = k } })
            if (i !== last) { last = i; setAt(i) }
          },
        },
      })
        .fromTo(track, { x: 0 }, { x: () => -dist(), ease: 'none', duration: 1 }, 0)
        .fromTo(r.querySelector('.fc__fill'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
        .set({}, {}, 1.2)
      r.classList.add('is-live')
      return () => { r.classList.remove('is-live'); setAt(0) }
    })
    mm.add(FLAT, () => {
      // the step in the middle of the screen is the red one; the state, not the DOM, says which (a class set by
      // hand was lost on the next render)
      r.querySelectorAll<HTMLElement>('.fc__step').forEach((s, i) => {
        gsap.fromTo(s, { y: 30 }, { y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: s, start: 'top 86%', once: true } })
        ScrollTrigger.create({ trigger: s, start: 'top 60%', onEnter: () => setAt(i), onLeaveBack: () => setAt(Math.max(0, i - 1)) })
      })
      rise(r.querySelector('.fc__end')!, r.querySelector('.fc__end')!, { start: 'top 92%' })
      r.classList.add('is-walk')
      return () => { r.classList.remove('is-walk'); setAt(0) }
    })
  }, { scope: root })

  return (
    <section className="fc" aria-labelledby="fc-h" ref={root}>
      <div className="fc__stage">
        <div className="fc__track">
          <div className="fc__intro">
            <h2 className="t t-1" id="fc-h"><TitleText title={HAPPENS.title} /></h2>
            <p className="fc__hint" aria-hidden="true"><span>4 steps</span><Icon name="arrow" /></p>
          </div>
          <ol className="fc__steps" role="list">
            {STEPS.map((s, i) => (
              <li key={s.t} className={`fc__step fc__step--${s.kind}${i === at ? ' on' : i < at ? ' done' : ''}`}>
                <div className="fc__media">
                  <Obj kind={s.kind} />
                </div>
                <div className="fc__body">
                  <p className="fc__t"><span className="sr">Step {i + 1}. </span>{s.t}</p>
                  {s.d ? <p className="fc__d">{s.d}</p> : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="fc__end">
            <Cta label={LP_CTA} />
            <p className="fc__talk">{HAPPENS.talk} <a href={SITE.phone.tel}><Icon name="phone" />{SITE.phone.display}</a></p>
          </div>
        </div>
        {/* the site's own progress bar (the home programs' pt__bar), Adryan 16/11 */}
        <div className="shell pt__bar fc__bar" aria-hidden="true"><span>{pad(at + 1)} / {pad(STEPS.length)}</span><i><b className="fc__fill" /></i></div>
      </div>
    </section>
  )
}
