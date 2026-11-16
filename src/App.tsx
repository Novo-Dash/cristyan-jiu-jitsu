import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { LpFooter } from './components/lp/Closing'
import { Nav } from './components/layout/Nav'
import { ScrollTrigger } from './lib/gsap'
import { scrollToTarget, startLenis } from './lib/lenis'
import { motionOK } from './lib/motion'
import { useBooking } from './nd'
import { fbTrack, gaTrack } from './nd/tracking'
import type { Route } from './routes'

/** The shell of every page: skip link, nav, the page, footer. Lenis smooth scroll on desktop-class
 *  pointers; in-page anchors go through it; it holds still while the booking form is open. */
export default function App({ route }: { route: Route }) {
  const { isOpen } = useBooking()
  useEffect(() => {
    const stopLenis = motionOK() && matchMedia('(pointer: fine)').matches ? startLenis() : () => {}
    const onClick = (e: MouseEvent) => {
      // a tap on the phone number is a lead for the campaign: one event each to Meta and GA4 (no-ops without ids)
      const tel = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="tel:"]')
      if (tel) { fbTrack({ custom: 'ClickToCall' }); gaTrack('click_to_call', { link_url: tel.href }); return }
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const id = a?.getAttribute('href')
      if (!a || !id || id === '#') return
      const target = document.querySelector<HTMLElement>(id)
      if (!target) return
      e.preventDefault()
      scrollToTarget(target, !motionOK())
    }
    document.addEventListener('click', onClick)
    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    addEventListener('load', refresh)
    return () => { stopLenis(); document.removeEventListener('click', onClick); removeEventListener('load', refresh) }
  }, [])
  useEffect(() => { const l = window.__lenis; if (!l) return; if (isOpen) l.stop(); else l.start() }, [isOpen])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav path={route.path} bare={!!route.lp} />
      <main id="main">{route.page()}</main>
      {route.lp && !route.lp.siteFooter ? <LpFooter /> : <Footer />}
    </>
  )
}
