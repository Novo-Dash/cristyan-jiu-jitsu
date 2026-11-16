import { useRef } from 'react'
import { SAME_HOUR } from '../../data/lp'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { FLAT, motionOK, SCENE } from '../../lib/motion'
import { Photo } from '../ui/Photo'
import { Tag, TitleText } from '../ui/Title'

const TICKS = Array.from({ length: 12 }, (_, i) => i)

/**
 * "Your kid trains. You train. Same hour." Two rooms, one clock. The kid's class and the parent's class open
 * from the two edges of the frame toward each other while the clock between them runs from 4:00 to 5:30 and
 * stops; when the hands land, the two photos meet at the seam and the time is stamped under it. The whole
 * argument (no waiting in the car) is the two halves closing on one time. Desktop: a sticky stage about two
 * screens tall. Phones and reduced motion: the two photos stacked with the clock between them, the hands
 * turning once on arrival.
 */
export function SameHour() {
  const root = useRef<HTMLElement>(null)
  const S = SAME_HOUR
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    const hm = r.querySelector('.sh2__m'), hh = r.querySelector('.sh2__h')
    const mm = gsap.matchMedia()
    mm.add(SCENE, () => {
      gsap.timeline({ scrollTrigger: { trigger: r, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } })
        .fromTo(r.querySelector('.sh2__a'), { clipPath: 'inset(0% 82% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(r.querySelector('.sh2__b'), { clipPath: 'inset(0% 0% 0% 82%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(r.querySelectorAll('.sh2__f img'), { scale: 1.25 }, { scale: 1.02, ease: 'none', duration: 1 }, 0)
        .fromTo(hm, { rotate: 0 }, { rotate: 540, ease: 'power1.inOut', duration: 1 }, 0)
        .fromTo(hh, { rotate: 120 }, { rotate: 165, ease: 'power1.inOut', duration: 1 }, 0)
        .fromTo(r.querySelector('.sh2__stamp'), { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, ease: 'power4.in', duration: 0.12 }, 0.92)
        .fromTo(r.querySelectorAll('.sh2__f figcaption'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.85)
        .set({}, {}, 1.25)
      r.classList.add('is-live')
      return () => r.classList.remove('is-live')
    })
    mm.add(FLAT, () => {
      const st = { trigger: r.querySelector('.sh2__clock'), start: 'top 80%', once: true }
      gsap.fromTo(hm, { rotate: 0 }, { rotate: 540, duration: 1.6, ease: 'power2.inOut', scrollTrigger: st })
      gsap.fromTo(hh, { rotate: 120 }, { rotate: 165, duration: 1.6, ease: 'power2.inOut', scrollTrigger: st })
    })
  }, { scope: root })

  return (
    <section className="sh2" aria-labelledby="sh2-h" ref={root}>
      <div className="sh2__stage">
        <div className="shell sh2__in">
          <div className="sh2__copy">
            <div><Tag>{S.tag}</Tag><h2 className="t t-1" id="sh2-h"><TitleText title={S.title} /></h2></div>
            <div className="sh2__side"><p className="lead">{S.body}</p></div>
          </div>
          <div className="sh2__pair">
            <figure className="sh2__f sh2__a"><Photo photo={S.kid.photo} sizes="(max-width: 899px) 92vw, 46vw" alt="" /><figcaption>{S.kid.label}</figcaption></figure>
            <figure className="sh2__f sh2__b"><Photo photo={S.you.photo} sizes="(max-width: 899px) 92vw, 46vw" alt="" /><figcaption>{S.you.label}</figcaption></figure>
            <div className="sh2__clock" aria-label={`${S.time}, ${S.days}`}>
              <div className="sh2__face" aria-hidden="true">
                {TICKS.map((t) => <i key={t} style={{ transform: `rotate(${t * 30}deg)` }} />)}
                <b className="sh2__h" /><b className="sh2__m" /><span className="sh2__c" />
              </div>
              <p className="sh2__stamp"><b>{S.time}</b><span>{S.days}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
