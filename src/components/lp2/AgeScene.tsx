import { useRef, useState } from 'react'
import { AGES, AGE_TICKS, LP_CTA } from '../../data/lp'
import { AGE_ADV, AGE_SCENE } from '../../data/lpv2'
import { gsap, lines, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useBooking } from '../../nd'
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
/** phones: the stretch of the ruler each room covers while it is read (4 to 7, 7 to 9, 9 to 12, 12 to 16, 16) */
const SPAN = P.map((p, i) => [i === 0 ? 4 : p.from, i < P.length - 1 ? P[i + 1].from : LAST] as const)

/**
 * "Four kids programs. Never one mixed room." The page's mechanism: you scroll your child's age. A ruler from
 * 4 to 16+ runs under a giant age; as the scroll pushes the marker along it, the age counts up and the room that
 * takes that age slides in on the right (its photo wipes over the last one, its name, hours and button), while
 * the band of that program lights red on the ruler. A 4-year-old and a 12-year-old never land in the same room,
 * and the visitor sees it happen. Desktop: a sticky stage about four screens tall, every frame from the scroll.
 * Phones (Adryan, 17/11): the ruler stands vertical on the left, the rooms are stacked on the right and the
 * marker runs down the ages as they scroll by; nothing pins, nothing moves sideways.
 */
export function AgeScene() {
  const root = useRef<HTMLElement>(null)
  const [age, setAge] = useState(4)
  const [vAt, setVAt] = useState(0)
  const [vAge, setVAge] = useState(4)
  const { open } = useBooking()

  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    r.querySelectorAll('h2').forEach((h) => lines(h))
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const mark = r.querySelector<HTMLElement>('.as__mark')!, fill = r.querySelector<HTMLElement>('.as__fill')!
      let last = -1
      const paint = (p: number) => {
        // a short hold on 4 at the start and on 16+ at the end, the count in between
        const u = Math.max(0, Math.min(1, (p - 0.04) / 0.86))
        const a = 4 + u * (LAST - 4)
        const whole = Math.min(LAST, Math.floor(a + 0.0001))
        if (whole !== last) { last = whole; setAge(whole) }
        const x = pct(a)
        // left in %, not a cqw translate: under the ultrawide zoom (.shell zoom) Chrome scales cqw twice and the
        // marker fell behind the count (Adryan, 18/11)
        mark.style.left = `${x}%`
        fill.style.transform = `scaleX(${x / 100})`
      }
      const proxy = { p: 0 }
      paint(0)
      gsap.to(proxy, { p: 1, ease: 'none', onUpdate: () => paint(proxy.p), scrollTrigger: { trigger: r, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true } })
      r.classList.add('is-live')
      return () => { r.classList.remove('is-live'); setAge(4) }
    })
    // phones (Adryan, 17/11): no pinned screen, no sideways move. The ruler stands on the left and holds while
    // the rooms scroll by on the right; its marker runs down through each room's ages as that room is read.
    mm.add('(max-width: 899px)', () => {
      const mark = r.querySelector<HTMLElement>('.as__vmark')!, fill = r.querySelector<HTMLElement>('.as__vfill')!
      const cells = [...r.querySelectorAll<HTMLElement>('.as__vlist > li')]
      let lastAge = -1, lastAt = -1
      const put = (a: number, i: number) => {
        const y = pct(a)
        mark.style.top = `${y}%`
        fill.style.transform = `scaleY(${y / 100})`
        const whole = Math.min(LAST, Math.floor(a + 0.0001))
        if (whole !== lastAge) { lastAge = whole; setVAge(whole) }
        if (i !== lastAt) { lastAt = i; setVAt(i) }
      }
      put(4, 0)
      cells.forEach((c, i) => {
        const [a, b] = SPAN[i]
        ScrollTrigger.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onUpdate: (s) => put(a + s.progress * (b - a), i), onEnter: () => put(a, i), onEnterBack: () => put(b, i) })
        gsap.fromTo(c, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: c, start: 'top 90%', once: true } })
      })
      return () => { setVAt(0); setVAge(4) }
    })
  }, { scope: root })

  const at = progOf(age)
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
                    {p.start ? <p className="as__n"><span className="as__start">{p.no}</span></p> : null}
                    {/* the same card as on phones (Adryan, 17/11): the class name big on one line, the ages a badge beside it */}
                    <div className="as__head">
                      <h3 className="as__name">{p.name}</h3>
                      <p className="as__yrs"><b>{range(p)}</b><span>Years<br />old</span></p>
                    </div>
                    <p className="as__txt">{p.text}</p>
                    {p.start ? <p className="as__adv"><b>{AGE_ADV.name}.</b> {AGE_ADV.text}</p> : null}
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
        <div className="as__vert">
          <div className="as__vcol" aria-hidden="true">
            <div className="as__vr">
              <span className="as__vtrack"><i className="as__vfill" /></span>
              <ol className="as__vnums" role="list">{AGE_TICKS.map((a) => <li key={a} className={a <= vAge ? 'on' : ''} style={{ top: `${pct(a)}%` }}>{label(a)}</li>)}</ol>
              <span className="as__vmark"><i><Mark /></i></span>
            </div>
          </div>
          <ul className="as__vlist" role="list">
            {P.map((p, i) => (
              <li key={p.id} className={`as__cell as__cell--${p.id}${i === vAt ? ' on' : ''}`}>
                <i className="as__fph"><Photo photo={p.photo} sizes="80vw" /></i>
                <div className="as__fb">
                  {p.start ? <p className="as__n"><span className="as__start">{p.no}</span></p> : null}
                  {/* phones (Adryan, 17/11): the class name is the big line, the ages read as words under it */}
                  <h3 className="as__name">{p.name}</h3>
                  <p className="as__yrs"><b>{range(p)}</b><span>Years<br />old</span></p>
                  <p className="as__txt">{p.text}</p>
                  {p.start ? <p className="as__adv"><b>{AGE_ADV.name}.</b> {AGE_ADV.text}</p> : null}
                  <button type="button" className="as__go" onClick={() => open({ audience: p.audience })}><span>{LP_CTA}</span><Icon name="arrow" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="as__fend"><Cta label={LP_CTA} /></div>
      </div>
    </section>
  )
}
