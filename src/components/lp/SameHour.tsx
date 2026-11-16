import { useRef } from 'react'
import { SAME_HOUR } from '../../data/lp'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Photo } from '../ui/Photo'
import { Tag, TitleText } from '../ui/Title'

/**
 * "Same hour": the kid's class and the parent's class arrive from opposite sides and meet on one clock,
 * 5:30 PM (scrubbed as the section comes in, never pinned). Two rooms, one time: the whole argument.
 * Phones: the two photos stacked with the clock between them, no motion.
 */
export function SameHour() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    gsap.matchMedia().add('(min-width: 900px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: r.querySelector('.sh__pair'), start: 'top 90%', end: 'center 55%', scrub: 0.6 } })
        .fromTo(r.querySelector('.sh__a'), { xPercent: -16, rotate: -5 }, { xPercent: 0, rotate: -2, ease: 'power2.out' }, 0)
        .fromTo(r.querySelector('.sh__b'), { xPercent: 16, rotate: 5 }, { xPercent: 0, rotate: 2, ease: 'power2.out' }, 0)
        .fromTo(r.querySelector('.sh__clock'), { scale: 0.4, opacity: 0, rotate: -45 }, { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(1.6)' }, 0.35)
    })
  }, { scope: root })
  const S = SAME_HOUR
  return (
    <section className="sec sh" data-nav="dark" aria-labelledby="sh-h" ref={root}>
      <div className="shell sh__in">
        <div className="sh__copy">
          <Tag light>{S.tag}</Tag>
          <h2 className="t t-1" id="sh-h"><TitleText title={S.title} /></h2>
          <p className="lead">{S.body}</p>
          <div className="sh__acts"><Cta label={S.cta} /></div>
        </div>
        <div className="sh__pair" aria-hidden="true">
          <figure className="sh__f sh__a"><Photo photo={S.kid.photo} sizes="(max-width: 899px) 70vw, 26vw" alt="" /><figcaption>{S.kid.label}</figcaption></figure>
          <div className="sh__clock"><b>{S.time}</b><span>{S.days}</span></div>
          <figure className="sh__f sh__b"><Photo photo={S.you.photo} sizes="(max-width: 899px) 70vw, 26vw" alt="" /><figcaption>{S.you.label}</figcaption></figure>
        </div>
      </div>
    </section>
  )
}
