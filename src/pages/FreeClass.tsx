import { LP_CTA, LP_HERO, PENDING, VOICES } from '../data/lp'
import { SITE } from '../data/site'
import { Ages } from '../components/lp/Ages'
import { LpClosing, LpFaq } from '../components/lp/Closing'
import { Coach } from '../components/lp/Coach'
import { Gallery } from '../components/lp/Gallery'
import { Happens } from '../components/lp/Happens'
import { SameHour } from '../components/lp/SameHour'
import { Voices } from '../components/lp/Voices'
import { Week } from '../components/lp/Week'
import { Hero } from '../components/sections/Hero'
import { Icon } from '../components/ui/Icon'
import { Pending } from '../components/ui/Pending'

/**
 * /free-class · the landing page for paid traffic (Adryan, 13/11/2026): the approved copy, section by section,
 * on the site's design system (the same hero card that opens on scroll, the program cards, the professor card,
 * the reviews, the FAQ, the closing and the map). No site links in the nav or the footer; every button opens
 * the Novo Dash booking form.
 */
export function FreeClassPage() {
  const trust = (
    <ul className="trust" role="list">
      {LP_HERO.trust.map((t) => <li key={t}><Icon name="check" />{t}</li>)}
      <li><a href={SITE.google.url} target="_blank" rel="noopener"><Icon name="star" /><span><b>{VOICES.badge.rating}</b> on Google ({VOICES.badge.count} reviews)</span></a></li>
    </ul>
  )
  const video = (
    <figure className="hc__vsl lp-vsl">
      <span className="hc__play" aria-hidden="true"><i /></span>
      <figcaption><Pending dark block>{PENDING.video}</Pending></figcaption>
    </figure>
  )
  return (
    <>
      <Hero home className="hc--lp" eyebrow="" title={LP_HERO.title} sub={LP_HERO.sub} photo={LP_HERO.photo} pos="50% 40%"
        cta={LP_CTA} proof={trust} media={video} />
      <Ages />
      <Happens />
      <Coach />
      <Gallery />
      <Voices />
      <Week />
      <SameHour />
      <LpFaq />
      <LpClosing />
    </>
  )
}
