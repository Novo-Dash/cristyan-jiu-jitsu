import { useEffect, useRef, useState } from 'react'
import { LP_CLOSE, LP_CTA, LP_FAQ, LP_FOOT, PENDING } from '../../data/lp'
import { SITE } from '../../data/site'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Accordion } from '../ui/Accordion'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Mark } from '../ui/Mark'
import { Pending } from '../ui/Pending'
import { Photo } from '../ui/Photo'
import { TitleText } from '../ui/Title'

/** "Before your first class": the site's centred FAQ with the LP's questions. */
export function LpFaq() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => { if (motionOK()) { lines(root.current!.querySelector('h2')!); rise('.qa', root.current!, { stagger: 0.05 }) } }, { scope: root })
  const items = LP_FAQ.items.map((f) => ({ q: f.q, a: f.pending ? <>{f.a} <Pending>{f.pending}</Pending></> : f.a }))
  return (
    <section className="sec faq" id="faq" aria-labelledby="faq-h" ref={root}>
      <div className="shell faq__in">
        <div className="head head--c"><h2 className="t t-1" id="faq-h"><TitleText title={LP_FAQ.title} /></h2></div>
        <Accordion items={items} />
        <div className="faq__acts"><Cta label={LP_CTA} /><a className="call" href={SITE.phone.tel}><Icon name="phone" />{SITE.phone.display}</a></div>
      </div>
    </section>
  )
}

/** The last call: the whole academy on the mats, fading into the footer's ink. */
export function LpClosing() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    gsap.fromTo(root.current!.querySelector('.cl__bg img'), { yPercent: -6, scale: 1.12 }, { yPercent: 4, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
  }, { scope: root })
  return (
    <section className="cl lpcl" data-nav="dark" aria-labelledby="cl-h" ref={root}>
      <div className="cl__bg" aria-hidden="true"><Photo photo={LP_CLOSE.photo} alt="" sizes="100vw" /></div>
      <div className="shell cl__in">
        <h2 className="t t-1" id="cl-h"><TitleText title={LP_CLOSE.title} /></h2>
        <div className="cl__acts"><Cta label={LP_CTA} /><a className="call call--l" href={SITE.phone.tel}><Icon name="phone" />{LP_CLOSE.micro} {SITE.phone.display}</a></div>
      </div>
    </section>
  )
}

/**
 * The LP's footer: the site's map (the real map as the background, the pin on the academy), the storefront
 * photo and the visit card with the approved lines. No site links, so the visit stays on the page.
 */
export function LpFooter() {
  const root = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '700px' })
    io.observe(root.current!)
    return () => io.disconnect()
  }, [])
  return (
    <footer className="foot lpf" data-nav="dark" ref={root}>
      <section className="find" aria-label="Visit the academy">
        <div className="find__map" aria-hidden="true">
          {near && <iframe title={`Map: ${SITE.academy}, ${SITE.address.line}`} src={SITE.maps.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />}
          <span className="find__shade" />
        </div>
        <div className="shell find__in">
          <div className="find__grid">
            <figure className="find__ph"><Photo photo={LP_FOOT.photo} sizes="(max-width: 899px) 92vw, 380px" /></figure>
            <div className="find__card">
              <b>{LP_FOOT.academy}</b>
              <p>{SITE.address.line}</p>
              <div className="find__btns">
                <a className="chip chip--l" href={SITE.maps.directions} target="_blank" rel="noopener"><Icon name="pin" />{LP_FOOT.directions}</a>
              </div>
              <Pending dark>{PENDING.place}</Pending>
              <ul className="find__list" role="list">
                <li><a href={SITE.phone.tel}><Icon name="phone" /><span>{SITE.phone.display}<small>{LP_CLOSE.micro}</small></span></a></li>
                <li><span className="find__hours lpf__also"><Mark /><span>{LP_FOOT.also.label}<small>{LP_FOOT.also.items.join(' · ')}</small></span></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="shell foot__base">
        <p>© 2026 {SITE.legalName}</p>
        <p>Website by <a href="https://novodash.com" target="_blank" rel="noopener">Novo Dash</a></p>
      </div>
    </footer>
  )
}
