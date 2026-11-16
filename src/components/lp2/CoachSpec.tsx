import { useRef } from 'react'
import { COACH } from '../../data/lp'
import { COACH_FACTS } from '../../data/lpv2'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Mark } from '../ui/Mark'
import { Photo } from '../ui/Photo'
import { Tag } from '../ui/Title'

const MARKS = [-2, -1, 0, 1, 2]

/**
 * "He studied how kids learn before he taught them to fight." The coach as the object of the section: his
 * cutout standing on the bottom edge of the red panel with the logo's marks, and his bio taken apart into six
 * facts that hang on both sides of him, each on a line that runs to him (the credentials are his, not a box of
 * numbers). Scrolling in, the panel rises, he climbs onto it and the lines draw out to their facts, left then
 * right, so his career reads as one sentence. He stands on the bottom edge of the section itself (Adryan,
 * 16/11: no line, no button, no margin under him). Phones: the facts in two columns, him at the bottom.
 */
export function CoachSpec() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    const st = { trigger: r.querySelector('.cs__stage'), start: 'top 85%', end: 'top 25%', scrub: 0.7 }
    gsap.timeline({ scrollTrigger: st })
      .fromTo(r.querySelector('.cs__panel'), { scaleY: 0.4 }, { scaleY: 1, ease: 'power2.out' }, 0)
      .fromTo(r.querySelectorAll('.cs__marks svg'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', stagger: { each: 0.05, from: 'center' } }, 0)
      .fromTo(r.querySelector('.cs__me'), { yPercent: 26 }, { yPercent: 0, ease: 'power2.out' }, 0.1)
    gsap.matchMedia().add('(min-width: 900px)', () => {
      const facts = [...r.querySelectorAll<HTMLElement>('.cs__f')]
      gsap.timeline({ scrollTrigger: { trigger: r.querySelector('.cs__stage'), start: 'top 60%', once: true } })
        .fromTo(facts.map((f) => f.querySelector('.cs__ln')), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out', stagger: 0.12 }, 0)
        .fromTo(facts.map((f) => f.querySelector('.cs__fb')), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 }, 0.2)
    })
    // phones: the six facts come in two by two, their red rule drawing down first
    gsap.matchMedia().add('(max-width: 899px)', () => {
      const fb = [...r.querySelectorAll<HTMLElement>('.cs__fb')]
      const order = [0, 3, 1, 4, 2, 5].map((i) => fb[i]).filter(Boolean)
      gsap.fromTo(order, { opacity: 0, x: -16, '--rule': 0 }, { opacity: 1, x: 0, '--rule': 1, duration: 0.7, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: r.querySelector('.cs__stage'), start: 'top 78%', once: true } })
    })
  }, { scope: root })

  const fact = (f: { n: string; t: string }, side: 'l' | 'r') => (
    <li key={f.n} className={`cs__f cs__f--${side}`}>
      <span className="cs__fb"><b>{f.n}</b><span>{f.t}</span></span>
      <i className="cs__ln" aria-hidden="true" />
    </li>
  )

  return (
    <section className="sec cs" id="coach" aria-labelledby="cs-h" ref={root}>
      <div className="shell">
        <div className="cs__head">
          <Tag>{COACH.eyebrow}</Tag>
          <h2 className="t t-1" id="cs-h">{COACH.title.a}<span className="hl">{COACH.title.b}</span>{COACH.title.c}</h2>
        </div>
        <div className="cs__stage">
          <ul className="cs__col cs__col--l" role="list">{COACH_FACTS.left.map((f) => fact(f, 'l'))}</ul>
          <div className="cs__mid">
            <div className="cs__panel" data-nav="dark" aria-hidden="true"><div className="cs__marks">{MARKS.map((i) => <Mark key={i} />)}</div></div>
            <div className="cs__me"><Photo photo={COACH.cutout} sizes="(max-width: 899px) 70vw, 380px" /></div>
          </div>
          <ul className="cs__col cs__col--r" role="list">{COACH_FACTS.right.map((f) => fact(f, 'r'))}</ul>
        </div>
      </div>
    </section>
  )
}
