import type { ReactNode } from 'react'
import { TRACKS } from './data/site'
import { AboutPage, Home, InstructorsPage, ProgramsPage, SchedulePage, TrackPage } from './pages/pages'
import { FreeClassPage } from './pages/FreeClass'
import { LpPage } from './pages/Lp'
import { BlogPage, PostPage, coverOf } from './pages/blog'
import { POSTS } from './data/blog.gen'
import { LP_BOOK_COPY } from './data/lp'
import type { Copy } from './nd/config'

export type Route = {
  path: string; title: string; description: string; image?: string; page: () => ReactNode; article?: { date: string }
  /** a landing page: the bare nav (logo + phone) and the LP footer, no site links; never indexed, not in the sitemap */
  // siteFooter: the landing page closes on the site's own footer (/lp, Adryan 16/11)
  lp?: { book: Partial<Copy>; siteFooter?: boolean }
}

const brand = 'Cristyan Jiu-Jitsu & Fitness'
/** Every page of the site: path, <title>, meta description (SEO + link preview), and its page. */
export const ROUTES: Route[] = [
  { path: '/', title: `Brazilian Jiu-Jitsu in Hyannis, MA | ${brand}`, description: 'Brazilian Jiu-Jitsu for kids and adults, Judo, Capoeira and Box Fitness in Hyannis, MA, led by Professor Cristyan Martins, 4th-degree black belt. Your first class is free.', page: () => <Home /> },
  { path: '/programs', title: `Martial Arts Programs in Hyannis, MA | ${brand}`, description: "Kids BJJ in four age groups, adult BJJ in three levels, Women's Self-Defense, Judo, Capoeira and Box Fitness in Hyannis, MA. Book a free trial class.", page: () => <ProgramsPage /> },
  ...TRACKS.map((t) => ({ path: `/programs/${t.slug}`, title: `${t.name} in Hyannis, MA | ${brand}`, description: t.lead.slice(0, 158), image: t.photo.src, page: () => <TrackPage t={t} /> })),
  { path: '/schedule', title: `Class Schedule | ${brand}, Hyannis MA`, description: 'Weekly class schedule of Cristyan Jiu-Jitsu & Fitness in Hyannis, MA: kids BJJ from 4:30 PM, teens, adults, Judo, Capoeira and Box Fitness until 9:00 PM.', page: () => <SchedulePage /> },
  { path: '/instructors', title: `Instructors | ${brand}, Hyannis MA`, description: 'Meet Professor Cristyan Martins, 4th-degree black belt and two-time world champion, and the instructors of Cristyan Jiu-Jitsu & Fitness in Hyannis, MA.', page: () => <InstructorsPage /> },
  { path: '/blog', title: `Jiu-Jitsu Blog: Tips & Insights | ${brand}, Hyannis MA`, description: 'Guides on Brazilian Jiu-Jitsu, self-defense, fitness and kids martial arts for Hyannis and Cape Cod, and news from the academy.', page: () => <BlogPage /> },
  ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} | ${brand}`, description: p.desc.slice(0, 158), image: coverOf(p).src, article: { date: p.iso }, page: () => <PostPage p={p} /> })),
  { path: '/free-class', title: `Free Kids Jiu-Jitsu Class in Hyannis, MA | ${brand}`, description: 'Jiu-Jitsu in Hyannis for kids 4 to 15, split into four age groups, and a Novice class for adults who have never trained. Your first class is free.', page: () => <FreeClassPage />, lp: { book: LP_BOOK_COPY } },
  { path: '/lp', title: `Free Kids Jiu-Jitsu Class in Hyannis, MA | ${brand}`, description: 'Jiu-Jitsu in Hyannis for kids 4 to 15, split into four age groups, and a Novice class for adults who have never trained. Your first class is free.', page: () => <LpPage />, lp: { book: LP_BOOK_COPY, siteFooter: true } },
  { path: '/about', title: `About the Academy | ${brand}, Hyannis MA`, description: 'A family academy in Hyannis, MA: structured jiu-jitsu classes, a clear curriculum and measurable progress, from a 1,000 to a 5,000 sq ft academy.', page: () => <AboutPage /> },
]

export const routeOf = (path: string) => ROUTES.find((r) => r.path === (path.replace(/\/$/, '') || '/'))
