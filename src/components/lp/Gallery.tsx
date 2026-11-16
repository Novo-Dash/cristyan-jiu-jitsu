import { useRef } from 'react'
import { GALLERY, PENDING } from '../../data/lp'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { Icon } from '../ui/Icon'
import { Pending } from '../ui/Pending'
import { Photo } from '../ui/Photo'
import { TitleText } from '../ui/Title'

/**
 * "Real students. Real mat. Hyannis." On pure black, one big frame and three around it; each photo drifts
 * inside its frame at its own speed as you pass (depth, the room seen as you walk by). The real shots are
 * pending: the site's own photos stand in and every frame names the shot that replaces it.
 * Phones: a swipe rail, no drift.
 */
export function Gallery() {
  const root = useRef<HTMLElement>(null)
  const rail = useRail<HTMLUListElement>()
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    rise(r.querySelectorAll('.gl__it'), r.querySelector('.gl__grid')!, { stagger: 0.08 })
    gsap.matchMedia().add('(min-width: 900px)', () => {
      r.querySelectorAll<HTMLElement>('.gl__ph img').forEach((im, i) => {
        const d = [9, 5, 7, 4][i] ?? 6
        gsap.fromTo(im, { yPercent: -d }, { yPercent: d, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    })
  }, { scope: root })
  return (
    <section className="sec gl" data-nav="dark" aria-labelledby="gl-h" ref={root}>
      <div className="shell">
        <div className="head head--row">
          <h2 className="t t-1" id="gl-h"><TitleText title={GALLERY.title} /></h2>
          <div className="gl__note"><Pending dark>{PENDING.photos}</Pending></div>
        </div>
        <ul className="gl__grid" role="list" ref={rail.ref}>
          {GALLERY.shots.map((s, i) => (
            <li key={s.want} className={`gl__it gl__it--${i}`}>
              <i className="gl__ph"><Photo photo={s.photo} sizes={i === 0 ? '(max-width: 899px) 84vw, 56vw' : '(max-width: 899px) 84vw, 30vw'} /></i>
              <Pending dark>{s.want}</Pending>
            </li>
          ))}
        </ul>
        <div className="rnav rnav--l" aria-hidden="true">
          <span>{String(Math.min(rail.at + 1, rail.count || 1)).padStart(2, '0')} / {String(rail.count).padStart(2, '0')}</span>
          <span className="rnav__b">
            <button type="button" className="sq" tabIndex={-1} onClick={() => rail.go(-1)}><Icon name="back" /></button>
            <button type="button" className="sq" tabIndex={-1} onClick={() => rail.go(1)}><Icon name="arrow" /></button>
          </span>
        </div>
      </div>
    </section>
  )
}
