import { useRef, useState } from 'react'
import { AGES, AGE_TICKS, LP_CTA } from '../../data/lp'
import { AGE_ADV, AGE_SCENE } from '../../data/lpv2'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { FLAT, motionOK, SCENE } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { useBooking } from '../../nd'
import { RailNav } from '../sections/Tracks'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Mark'
import { Photo } from '../ui/Photo'
import { Tag, TitleText } from '../ui/Title'

const P = AGE_SCENE
const LAST = AGE_TICKS[AGE_TICKS.length - 1]
/** the program an age lands in: 6 is still Tiny (4–6), 7 and 8 Little, 9–11 Youth, 12–15 Junior, 16+ Novice */
const progOf = (age: number) => (age <= 6 ? 0 : age <= 8 ? 1 : age <= 11 ? 2 : age <= 15 ? 3 : 4)
const label = (age: number) => (age >= LAST ? `${LAST}+` : String(age))
const pct = (age: number) => ((Math.min(age, LAST) - 4) / (LAST - 4)) * 100

/**
 * "Four kids programs. Never one mixed room." The page's mechanism: you scroll your child's age. A ruler from
 * 4 to 16+ runs under a giant age; as the scroll pushes the marker along it, the age counts up and the room that
 * takes that age slides in on the right (its photo wipes over the last one, its name, hours and button), while
 * the band of that program lights red on the ruler. A 4-year-old and a 12-year-old never land in the same room,
 * and the visitor sees it happen. Desktop: a sticky stage about four screens tall, every frame from the scroll.
 * Phones run the same scene stacked in one screen (Adryan, 16/11); short phones and reduced motion: tap an
 * age and the rail of rooms jumps to the one that takes it.
 */
export function AgeScene() {
  const root = useRef<HTMLElement>(null)
  const [age, setAge] = useState(4)
  const [pick, setPick] = useState<number | null>(null)
  const rail = useRail<HTMLUListElement>()
  const { open } = useBooking()

  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    r.querySelectorAll('h2').forEach((h) => lines(h))
    const mm = gsap.matchMedia()
    mm.add(SCENE, () => {
      const mark = r.querySelector<HTMLElement>('.as__mark')!, fill = r.querySelector<HTMLElement>('.as__fill')!
      let last = -1
      const paint = (p: number) => {
        // a short hold on 4 at the start and on 16+ at the end, the count in between
        const u = Math.max(0, Math.min(1, (p - 0.04) / 0.86))
        const a = 4 + u * (LAST - 4)
        const whole = Math.min(LAST, Math.floor(a + 0.0001))
        if (whole !== last) { last = whole; setAge(whole) }
        const x = pct(a)
        mark.style.transform = `translate3d(${x}cqw,0,0)`
        fill.style.transform = `scaleX(${x / 100})`
      }
      const proxy = { p: 0 }
      paint(0)
      gsap.to(proxy, { p: 1, ease: 'none', onUpdate: () => paint(proxy.p), scrollTrigger: { trigger: r, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true } })
      r.classList.add('is-live')
      return () => { r.classList.remove('is-live'); setAge(4) }
    })
    mm.add(FLAT, () => {
      rise(r.querySelectorAll('.as__tick'), r.querySelector('.as__ticks')!, { stagger: 0.03, y: 14 })
    })
  }, { scope: root })

  const at = progOf(age)
  const tap = (a: number) => {
    const next = a === pick ? null : a
    setPick(next)
    const t = rail.ref.current
    if (next === null || !t) return
    const c = t.children[progOf(next)] as HTMLElement | undefined
    if (c) t.scrollTo({ left: c.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft), behavior: motionOK() ? 'smooth' : 'auto' })
  }
  const head = (id: string) => (
    <div className="as__top">
      <div><Tag>{AGES.tag}</Tag><h2 className="t t-1" id={id}><TitleText title={AGES.title} /></h2></div>
      <p className="lead">{AGES.body}</p>
    </div>
  )
  const range = (p: (typeof P)[number]) => p.ages.replace(/^(Ages|Adults)\s*/, '')

  return (
    <section className="as" id="programs" aria-labelledby="as-h" ref={root}>
      <div className="as__stage">
        <div className="shell as__in">
          {head('as-h')}
          <div className="as__grid">
            <div className="as__left">
              <p className="as__age" aria-live="polite"><span className="as__k">{age >= LAST ? 'Adults' : 'Age'}</span><b key={age}>{label(age)}</b></p>
              <div className="as__ruler" aria-hidden="true">
                <span className="as__track"><i className="as__fill" /></span>
                <ol className="as__nums" role="list">{AGE_TICKS.map((a) => <li key={a} className={a <= age ? 'on' : ''} style={{ left: `${pct(a)}%` }}>{label(a)}</li>)}</ol>
                <ol className="as__bands" role="list">
                  {P.map((p, i) => (
                    <li key={p.id} className={i === at ? 'on' : i < at ? 'done' : ''} style={{ left: `${pct(p.from)}%`, width: `${Math.max(pct(Math.min(p.to, LAST)) - pct(p.from), 4)}%` }}>
                      <span>{p.audience === 'kids' ? p.name : 'Adults'}</span>
                    </li>
                  ))}
                </ol>
                <span className="as__mark"><i><Mark /></i></span>
              </div>
            </div>
            <div className="as__rooms">
              {P.map((p, i) => (
                <article key={p.id} className={`as__room as__room--${p.id}${i === at ? ' on' : i < at ? ' past' : ''}`} aria-hidden={i === at ? undefined : true}>
                  <i className="as__ph"><Photo photo={p.photo} sizes="(max-width: 899px) 84vw, 44vw" /></i>
                  <div className="as__card">
                    <p className="as__n">{p.start ? <span className="as__start">{p.no}</span> : <span>Room {p.no} / 04</span>}<i aria-hidden="true" /><span>{p.audience === 'kids' ? 'Kids' : 'Adults'}</span></p>
                    <div className="as__main">
                      <p className="as__big"><small>{p.audience === 'kids' ? 'Ages' : 'Adults'}</small><b>{range(p)}</b></p>
                      <div className="as__copy">
                        <h3 className="as__name">{p.name}</h3>
                        <p className="as__txt">{p.text}</p>
                        {p.start ? <p className="as__adv"><b>{AGE_ADV.name}.</b> {AGE_ADV.text}</p> : null}
                      </div>
                    </div>
                    <button type="button" className="as__go" tabIndex={i === at ? 0 : -1} onClick={() => open({ audience: p.audience })}>
                      <span>{LP_CTA}: {p.name}</span><Icon name="arrow" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell as__flat">
        {head('as-h2')}
        <div className="as__ticks" role="group" aria-label="Your child's age">
          {AGE_TICKS.map((a) => (
            <button key={a} type="button" className={`as__tick${pick !== null && progOf(pick) === progOf(a) ? ' on' : ''}`} aria-pressed={pick === a} onClick={() => tap(a)}>{label(a)}</button>
          ))}
        </div>
        <ul className="as__rail" role="list" ref={rail.ref}>
          {P.map((p, i) => (
            <li key={p.id} className={`as__cell as__cell--${p.id}${pick !== null && progOf(pick) === i ? ' on' : ''}`}>
              <i className="as__fph"><Photo photo={p.photo} sizes="80vw" /></i>
              <div className="as__fb">
                <p className="as__n">{p.start ? <span className="as__start">{p.no}</span> : <>Room {p.no} / 04</>}</p>
                <b className="as__range">{range(p)}</b>
                <h3 className="as__name">{p.name}</h3>
                <p className="as__txt">{p.text}</p>
                {p.start ? <p className="as__adv"><b>{AGE_ADV.name}.</b> {AGE_ADV.text}</p> : null}
                <button type="button" className="as__go" onClick={() => open({ audience: p.audience })}><span>{LP_CTA}</span><Icon name="arrow" /></button>
              </div>
            </li>
          ))}
        </ul>
        <RailNav go={rail.go} at={rail.at} count={P.length} label="program" />
        <div className="as__fend"><Cta label={LP_CTA} /></div>
      </div>
    </section>
  )
}
