import { useRef, useState } from 'react'
import { REVIEWS, SITE } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Icon } from '../ui/Icon'
import { Tag, TitleText, type Title } from '../ui/Title'

type Review = { text: string; name: string; meta?: string }

/** "Do families like it?" Real Google reviews (current site): a row of cards that slides one at a
 *  time, the active card black with its quote mark red. Phones: one card wide, no fade at the edges.
 *  The landing page (/lp) passes its own title and its three approved reviews. */
export function Reviews({ title, items = REVIEWS }: { title?: Title; items?: Review[] }) {
  const N = items.length
  const root = useRef<HTMLElement>(null)
  const [cur, setCur] = useState(0)
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })
  const go = (i: number) => setCur((i + N) % N)
  return (
    <section className="sec rv" id="reviews" aria-labelledby="rv-h" ref={root}>
      <div className="shell">
        <div className="head head--c">
          <Tag>Reviews</Tag>
          <h2 className="t t-1" id="rv-h">{title ? <TitleText title={title} /> : <>What families <span className="hl">say.</span></>}</h2>
          <a className="gbadge" href={SITE.google.url} target="_blank" rel="noopener"><span className="proof__stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" />)}</span><span><b>{SITE.google.rating}</b> on Google · {SITE.google.count} reviews</span></a>
        </div>
      </div>
      <div className="shell"><div className="rv__vp" role="region" aria-roledescription="carousel" aria-label="Google reviews">
        <ul className="rv__track" role="list" style={{ ['--i' as string]: cur }}>
          {items.map((r, i) => (
            <li key={r.name} className={`rc${i === cur ? ' on' : ''}`} aria-roledescription="slide" aria-label={`Review ${i + 1} of ${N}`} inert={Math.abs(i - cur) > 1} onClick={() => i !== cur && go(i)}>
              <span className="rc__q" aria-hidden="true">&ldquo;</span>
              <blockquote>{r.text}</blockquote>
              <p className="rc__who"><b>{r.name}</b><small>{r.meta && r.meta !== 'Google review' ? `${r.meta} · Google` : 'Google review'}</small></p>
            </li>
          ))}
        </ul>
      </div></div>
      <div className="rv__nav">
        <button type="button" aria-label="Previous review" onClick={() => go(cur - 1)}><Icon name="back" /></button>
        <span className="rv__dots" aria-hidden="true">{items.map((_, i) => <i key={i} className={i === cur ? 'on' : undefined} />)}</span>
        <button type="button" aria-label="Next review" onClick={() => go(cur + 1)}><Icon name="arrow" /></button>
      </div>
    </section>
  )
}
