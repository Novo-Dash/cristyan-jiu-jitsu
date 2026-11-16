import { useRef, useState } from 'react'
import { AGES, AGE_TICKS, LP_CTA, type AgeProgram } from '../../data/lp'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { useBooking } from '../../nd'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Mark'
import { Tag, TitleText } from '../ui/Title'

const KIDS = AGES.programs.filter((p) => p.audience === 'kids')
const fits = (p: AgeProgram, age: number) => age >= p.from && age <= p.to
/** ruler columns: 4 → 1 … 15 → 12, 16+ → 13 */
const col = (age: number) => Math.min(age, 16) - 3

/**
 * "Never one mixed room", made visible (the mechanism of the page): the ages 4 to 16+ on a ruler, each kids
 * program a three-year band under it, and the cards below. Tap an age and the program (or the two, at 6) that
 * takes it turns black with the logo's mark surfacing, as on the site's program cards; hover a card and its
 * band lights. The bands draw in left to right when the ruler arrives: the room being split by age.
 * Phones: the ages as a grid of squares, the cards as a swipe rail that jumps to the program you tapped.
 */
export function Ages() {
  const root = useRef<HTMLElement>(null)
  const [age, setAge] = useState<number | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const rail = useRail<HTMLUListElement>()
  const { open } = useBooking()

  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    gsap.fromTo(r.querySelectorAll('.ag__band i'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: r.querySelector('.ag__ruler'), start: 'top 82%', once: true } })
    rise(r.querySelectorAll('.ag__cell'), r.querySelector('.ag__cards')!, { stagger: 0.07 })
  }, { scope: root })

  const on = (p: AgeProgram) => (hover ? hover === p.id : age !== null && fits(p, age))
  const pick = (a: number) => {
    const next = a === age ? null : a
    setAge(next)
    const t = rail.ref.current
    if (next === null || !t || t.scrollWidth <= t.clientWidth + 4) return
    const i = AGES.programs.findIndex((p) => fits(p, next))
    const c = t.children[i] as HTMLElement | undefined
    if (c) t.scrollTo({ left: c.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft), behavior: motionOK() ? 'smooth' : 'auto' })
  }

  return (
    <section className="sec ag" id="programs" aria-labelledby="ag-h" ref={root}>
      <div className="shell">
        <div className="head head--row">
          <div><Tag>{AGES.tag}</Tag><h2 className="t t-1" id="ag-h"><TitleText title={AGES.title} /></h2></div>
          <p className="lead">{AGES.body}</p>
        </div>

        <div className="ag__ruler">
          <div className="ag__ticks" role="group" aria-label="Age">
            {AGE_TICKS.map((a) => {
              const lit = age === a || (hover !== null && fits(AGES.programs.find((p) => p.id === hover)!, a))
              return (
                <button key={a} type="button" className={`ag__tick${lit ? ' on' : ''}`} aria-pressed={age === a} onClick={() => pick(a)} style={{ gridColumn: col(a) }}>
                  {a === 16 ? '16+' : a}
                </button>
              )
            })}
          </div>
          <ol className="ag__bands" role="list" aria-hidden="true">
            {[...KIDS, AGES.programs.find((p) => p.start)!].map((p, i) => (
              <li key={p.id} className={`ag__band${on(p) ? ' on' : ''}`} style={{ gridColumn: `${col(p.from)} / ${col(Math.min(p.to, 16)) + 1}`, gridRow: (i % 2) + 1 }}>
                <i />
                <span>{p.audience === 'kids' ? p.name : 'Adults 16+'}</span>
              </li>
            ))}
          </ol>
        </div>

        <ul className="ag__cards" role="list" ref={rail.ref}>
          {AGES.programs.map((p) => {
            const [unit, range] = [p.ages.split(' ')[0], p.ages.split(' ').slice(1).join(' ')]
            return (
              <li key={p.id} className={`ag__cell${p.audience === 'adults' ? ' ag__cell--a' : ''}`}>
                <article className={`pc ag__card${on(p) ? ' is-active' : ''}${p.start ? ' ag__card--start' : ''}`}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(p.id) }} onPointerLeave={() => setHover(null)}>
                  <span className="pc__clip" aria-hidden="true"><span className="pc__mark"><Mark /></span></span>
                  <div className="pc__body">
                    <div className="ag__top">
                      {p.no ? <span className={p.start ? 'ag__start' : 'ag__no'}>{p.no}</span> : <span />}
                      <span className="ag__unit">{unit}</span>
                    </div>
                    <b className="ag__range" aria-hidden="true">{range}</b>
                    <h3 className="pc__name">{p.name}</h3>
                    <p className="pc__txt"><span className="sr">{p.ages}. </span>{p.text}</p>
                    <div className="pc__foot">
                      <span />
                      <button type="button" className="pc__go" aria-label={`${LP_CTA}: ${p.name}`} onClick={() => open({ audience: p.audience })}><Icon name="arrow" /></button>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        <div className="rnav" aria-hidden="true">
          <span>{String(Math.min(rail.at + 1, rail.count || 1)).padStart(2, '0')} / {String(rail.count).padStart(2, '0')}</span>
          <span className="rnav__b">
            <button type="button" className="sq" tabIndex={-1} onClick={() => rail.go(-1)}><Icon name="back" /></button>
            <button type="button" className="sq" tabIndex={-1} onClick={() => rail.go(1)}><Icon name="arrow" /></button>
          </span>
        </div>
        <div className="ag__acts"><Cta label={LP_CTA} /></div>
      </div>
    </section>
  )
}
