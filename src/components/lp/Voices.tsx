import { useEffect, useRef, useState } from 'react'
import { VOICES } from '../../data/lp'
import { SITE } from '../../data/site'
import { lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useRail } from '../../lib/useRail'
import { Icon } from '../ui/Icon'
import { TitleText } from '../ui/Title'

/** "What parents say": the three approved Google reviews side by side, the site's review card. The one under
 *  the pointer turns red (phones: the one in view), so the eye reads one at a time. */
export function Voices() {
  const root = useRef<HTMLElement>(null)
  const rail = useRail<HTMLUListElement>()
  const [cur, setCur] = useState(0)
  useEffect(() => { setCur(rail.at) }, [rail.at])
  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    rise(root.current!.querySelectorAll('.rc'), root.current!.querySelector('.vo__row')!, { stagger: 0.1 })
  }, { scope: root })
  const stars = <span className="proof__stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" />)}</span>
  return (
    <section className="sec vo" aria-labelledby="vo-h" ref={root}>
      <div className="shell">
        <div className="head head--c">
          <h2 className="t t-1" id="vo-h"><TitleText title={VOICES.title} /></h2>
          <a className="gbadge" href={SITE.google.url} target="_blank" rel="noopener">{stars}<span><b>{VOICES.badge.rating}</b> · {VOICES.badge.count} Google reviews</span></a>
        </div>
        <ul className="vo__row" role="list" ref={rail.ref}>
          {VOICES.reviews.map((r, i) => (
            <li key={r.name} className={`rc${i === cur ? ' on' : ''}`} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setCur(i) }}>
              <span className="rc__q" aria-hidden="true">&ldquo;</span>
              <blockquote>{r.text}</blockquote>
              <p className="rc__who"><b>{r.name}</b><small>Google review</small></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
