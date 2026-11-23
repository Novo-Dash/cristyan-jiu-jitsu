import { useEffect, useRef, useState, type ReactNode } from 'react'
import { HERO, SITE } from '../../data/site'
import type { Img } from '../../data/img'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta, Ghost } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Photo } from '../ui/Photo'
import { TitleText, type Title } from '../ui/Title'

type Props = {
  eyebrow: string; title: Title; sub: ReactNode; photo: Img; home?: boolean; pos?: string
  // a second photo for desktop, where the card is much wider than tall (Adryan, 11/11: the family photo
  // cut everyone's head on /instructors); phones keep `photo`
  wide?: { photo: Img; pos?: string }
  crumbs?: { label: string; href: string }[]; second?: { label: string; href: string }; audience?: 'kids' | 'adults'
  // a landing page (/free-class): its own button label, its own line under the button and its own media frame
  cta?: string; proof?: ReactNode; media?: ReactNode; className?: string
}

/**
 * Every page opens the same way (Adryan, 10/11: the white page with a card, the photo and the text inside
 * the card): a square card on the paper, the photo filling it under a long ink gradient, the title, the
 * line, the booking button. As you scroll the card opens to the edges and the photo pushes in (the zoom
 * right after the hero). Phones: the photo is a band at the top of the card and the text sits below it on
 * the ink, never over faces, the button on the first screen.
 */
export function Hero({ eyebrow, title, sub, photo, home, pos = '50% 45%', wide, crumbs, second, audience, cta, proof, media, className }: Props) {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('h1')!, 'top 95%')
    gsap.matchMedia().add('(min-width: 900px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: r, start: 'top top', end: 'bottom top', scrub: 0.5 } })
        .fromTo(r, { '--open': 0 }, { '--open': 1, ease: 'power2.out', duration: 0.6 }, 0)
        .fromTo(r.querySelector('.hc__bg img'), { scale: 1.06 }, { scale: 1.2, ease: 'none', duration: 1 }, 0)
        .fromTo(r.querySelector('.hc__dim'), { opacity: 0 }, { opacity: 0.5, ease: 'none', duration: 1 }, 0)
        .to(r.querySelectorAll('.hc__in, .hc__vsl'), { y: -70, autoAlpha: 0, ease: 'power1.in', duration: 0.5 }, 0)
    })
  }, { scope: root })

  return (
    <section className={`hc${home ? ' hc--home' : ''}${className ? ` ${className}` : ''}`} ref={root} aria-labelledby="h1">
      <div className="hc__card" data-nav="dark">
        <div className="hc__bg" aria-hidden="true">
          {wide ? (
            <picture>
              <source media="(min-width: 900px)" srcSet={wide.photo.sm ? `${wide.photo.src.replace(/\.webp$/, '-sm.webp')} ${wide.photo.sm}w, ${wide.photo.src} ${wide.photo.w}w` : wide.photo.src} sizes="96vw" width={wide.photo.w} height={wide.photo.h} />
              <Photo photo={photo} eager alt="" sizes="100vw" style={{ objectPosition: pos, ['--wpos' as string]: wide.pos ?? '50% 45%' }} className="hc__pic" />
            </picture>
          ) : <Photo photo={photo} eager alt="" sizes="(max-width: 899px) 100vw, 96vw" style={{ objectPosition: pos }} />}
          <i className="hc__dim" />
        </div>
        <div className="shell hc__copy">
          <div className="hc__in">
            {crumbs ? (
              <nav className="crumbs" aria-label="Breadcrumb">
                <a href="/">Home</a>
                {crumbs.map((c) => <a key={c.href} href={c.href}>{c.label}</a>)}
              </nav>
            ) : null}
            {eyebrow ? <p className="tag tag--l">{eyebrow}</p> : null}
            <h1 className={`t ${home ? 't-hero' : 't-1'}`} id="h1"><TitleText title={title} /></h1>
            <p className="hc__sub">{sub}</p>
            <div className="hc__acts">
              <Cta id={home ? 'heroCta' : undefined} audience={audience} label={cta} />
              {second ? <Ghost href={second.href} className="ghost--l">{second.label}</Ghost> : null}
            </div>
            {proof !== undefined ? proof : (
              <a className="proof" href={SITE.google.url} target="_blank" rel="noopener">
                <span className="proof__stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" />)}</span>
                <span><b>{SITE.google.rating}</b> on Google · {SITE.google.count} reviews</span>
              </a>
            )}
          </div>
          {media ?? (home ? <Vsl /> : null)}
        </div>
      </div>
    </section>
  )
}

/**
 * The academy's video in the hero (home and /lp): a facade until the tap, so the 4 MB file never weighs on the
 * first load or the LCP; the tap swaps in the player, which plays with sound and pauses when scrolled away.
 */
function Vsl() {
  const [on, setOn] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!on || !v) return
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) v.pause() }, { threshold: 0.2 })
    io.observe(v)
    return () => io.disconnect()
  }, [on])
  return (
    <figure className={`hc__vsl${on ? ' is-on' : ''}`} aria-label={HERO.vsl.label}>
      {on ? (
        <video ref={ref} src={HERO.vsl.src} poster={HERO.vsl.poster.src} controls autoPlay playsInline preload="auto" />
      ) : (
        <>
          <Photo photo={HERO.vsl.poster} sizes="(max-width: 899px) 62vw, 340px" alt="" />
          <button type="button" className="hc__vbtn" aria-label={`Play the video: ${HERO.vsl.title}`} onClick={() => setOn(true)}>
            <span className="hc__play" aria-hidden="true"><i /></span>
          </button>
          <figcaption><b>{HERO.vsl.title}</b><span>{HERO.vsl.note}</span></figcaption>
        </>
      )}
    </figure>
  )
}
