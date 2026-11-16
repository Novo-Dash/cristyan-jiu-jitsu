import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { LP_CTA, PENDING, WEEK } from '../../data/lp'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { useBooking } from '../../nd'
import { Cta } from '../ui/Cta'
import { Pending } from '../ui/Pending'
import { TitleText } from '../ui/Title'

const KEYS = WEEK.days.map((d) => d.k)

/**
 * The week, as text in tabs (approved copy): Monday to Friday, then the weekend. On the brand red, the only red
 * section of the page, so the schedule is easy to find again when you scroll back. Today opens first (Hyannis
 * time). Every class is a button that opens the form on kids or adult classes.
 */
export function Week() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()
  const [day, setDay] = useState(0)
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => {
    try {
      const d = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(new Date())
      const i = d === 'Sat' || d === 'Sun' ? KEYS.length - 1 : KEYS.indexOf(d)
      if (i >= 0) { setToday(i); setDay(i) }
    } catch { /* no time zones: Monday */ }
  }, [])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setDay((day + 1) % KEYS.length)
    if (e.key === 'ArrowLeft') setDay((day + KEYS.length - 1) % KEYS.length)
  }
  const d = WEEK.days[day]
  return (
    <section className="sec wk" id="schedule" data-nav="dark" aria-labelledby="wk-h" ref={root}>
      <div className="shell wk__in">
        <div className="wk__side">
          <h2 className="t t-1" id="wk-h"><TitleText title={WEEK.title} /></h2>
          <Pending dark>{PENDING.schedule}</Pending>
          <div className="wk__acts"><Cta label={LP_CTA} /></div>
        </div>
        <div className="wk__board">
          <div className="wk__tabs" role="tablist" aria-label="Day" onKeyDown={onKey}>
            {WEEK.days.map((x, i) => (
              <button key={x.k} type="button" role="tab" id={`wk-t${i}`} aria-controls="wk-p" aria-selected={day === i} tabIndex={day === i ? 0 : -1} onClick={() => setDay(i)}>
                {x.k}{today === i ? <i aria-label="today" /> : null}
              </button>
            ))}
          </div>
          <div className="wk__panel" role="tabpanel" id="wk-p" aria-labelledby={`wk-t${day}`} key={d.k}>
            {d.classes.length ? (
              <ul className="wk__list" role="list">
                {d.classes.map((c, i) => (
                  <li key={c.name + c.at} style={{ ['--i' as string]: i }}>
                    <button type="button" className={`wk__row wk__row--${c.kind}`} onClick={() => open({ audience: c.kind === 'kids' ? 'kids' : 'adults' })}>
                      <time>{c.at}<small> PM</small></time>
                      <span><b>{c.name}</b>{c.ages ? <small>{c.ages}</small> : c.adult ? <small>16+</small> : null}</span>
                      <em>Book</em>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="wk__closed">{d.k}: {WEEK.closed}</p>}
          </div>
        </div>
        <div className="wk__end"><Cta label={LP_CTA} /></div>
      </div>
    </section>
  )
}
