import { useRef } from 'react'
import { GALLERY } from '../../data/lp'
import { STRIP } from '../../data/lpv2'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK, SCENE } from '../../lib/motion'
import { Photo } from '../ui/Photo'
import { TitleText } from '../ui/Title'

/**
 * "Real students. Real mat. Hyannis." On white (Adryan, 16/11): the academy's own photos, all in colour (Adryan,
 * 16/11), on one strip that the scroll slides sideways. The reviews follow in the site's own carousel (same
 * design as the site). Phones slide it with the scroll too; short phones and reduced motion: a swipe rail.
 */
export function Proof() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h2')!)
    gsap.matchMedia().add(SCENE, () => {
      const strip = r.querySelector<HTMLElement>('.pr__strip')!
      const dist = () => Math.max(0, strip.scrollWidth - innerWidth * 0.62)
      gsap.fromTo(strip, { x: () => innerWidth * 0.18 }, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
      })
      r.classList.add('is-live')
      return () => r.classList.remove('is-live')
    })
  }, { scope: root })

  return (
    <section className="pr" aria-labelledby="pr-h" ref={root}>
      <div className="shell"><h2 className="t t-1" id="pr-h"><TitleText title={GALLERY.title} /></h2></div>
      <ul className="pr__strip" role="list">
        {STRIP.map((p, i) => <li key={p.src + i} className={`pr__it pr__it--${i % 3}`}><Photo photo={p} sizes="(max-width: 899px) 78vw, 30vw" /></li>)}
      </ul>
    </section>
  )
}
