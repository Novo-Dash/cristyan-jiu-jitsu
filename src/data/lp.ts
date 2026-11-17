// ─────────────────────────────────────────────────────────────────────────────
// /free-class · the paid-traffic landing page (Adryan, 13/11/2026). Every visitor word below is the
// approved copy, verbatim; nothing is added for the open points. Each open point is a PENDING entry
// (shown as a dashed placeholder on the page) until Anderson confirms it with the client.
// No em dashes in visitor copy ("4–6" keeps its range dash).
// ─────────────────────────────────────────────────────────────────────────────
import { img } from './img'

export const LP_CTA = 'Book my free class'

/** The open points (Anderson confirms with the client). The page shows each one as a dashed
 *  placeholder where its text or media will go; when one is answered, fill the copy and drop it here. */
export const PENDING = {
  gi: 'Pendente: o kimono é emprestado na aula experimental?',
  photos: 'Pendente: fotos reais (Drive do cliente)',
  video: 'Pendente: vídeo de apresentação (Arthur, AI Content)',
  place: 'Pendente: ponto de referência e estacionamento',
  schedule: 'Pendente: a grade vale no espaço novo?',
} as const

export const LP_HERO = {
  title: { a: 'Your child trains with kids ', b: 'their own age.' },
  sub: 'Jiu-Jitsu in Hyannis for kids 4 to 15, split into four age groups, and a Novice class for adults who have never trained. Taught by a 4th-degree black belt with a degree in Physical Education. Your first class is free.',
  // phones (Adryan, 17/11): the same promise in three lines instead of six
  subShort: 'Jiu-Jitsu for kids 4 to 15 in four age groups, plus a Novice class for adults. Your first class is free.',
  trust: ['No experience needed', 'No card on file'],
  photo: img('kids', 'The kids of Cristyan Jiu-Jitsu in their gis in front of the academy logo'),
}

// ── who's training: four kids programs, three years of age each, then the adults ──
export type AgeProgram = {
  id: string; no: string; ages: string; from: number; to: number; name: string; text: string
  audience: 'kids' | 'adults'; start?: boolean
}
export const AGES = {
  tag: "Who's training?",
  title: { a: 'Four kids programs. ', b: 'Never one mixed room.' },
  body: "A 4-year-old never trains with a 12-year-old here. Each kids program covers three years of age, because a child's coordination at 5 has little in common with a child's at 11.",
  programs: [
    { id: 'tiny', no: '01', ages: 'Ages 4–6', from: 4, to: 6, name: 'Tiny BJJ', audience: 'kids', text: 'Their first steps on the mat: balance, coordination and listening. 45-minute classes, Tue & Thu at 4:30 PM.' },
    { id: 'little', no: '02', ages: 'Ages 6–8', from: 6, to: 8, name: 'Little BJJ', audience: 'kids', text: 'Basic techniques, games with a purpose, and a coach who knows every name. Mon, Wed & Fri at 4:30 PM.' },
    { id: 'youth', no: '03', ages: 'Ages 9–11', from: 9, to: 11, name: 'Youth BJJ', audience: 'kids', text: 'Real technique and the confidence to hold their ground without picking a fight. Mon, Wed & Fri at 5:30 PM.' },
    { id: 'junior', no: '04', ages: 'Ages 12–15', from: 12, to: 15, name: 'Junior BJJ', audience: 'kids', text: 'A class for teens, with teens. Tue & Thu at 5:30 PM, No-Gi on Wed at 6:45 PM.' },
    { id: 'novice', no: 'Start here', ages: 'Adults 16+', from: 16, to: 99, name: 'Novice BJJ', audience: 'adults', start: true, text: 'Never trained? This is your class. Drills and core technique, no free sparring. Tue & Thu at 6:45 PM.' },
    { id: 'adv', no: '', ages: 'Adults 16+', from: 16, to: 99, name: 'Intermediate & Advanced', audience: 'adults', text: 'Unlimited training, up to five days a week, Gi and No-Gi.' },
  ] as AgeProgram[],
}
/** The ages on the ruler: 4 to 15, then 16+ */
export const AGE_TICKS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

// ── here's exactly what happens ──
export const HAPPENS = {
  title: { a: "Here's ", b: 'exactly what happens.' },
  steps: [
    { t: 'Pick your class, day and time.', d: 'It takes under a minute.' },
    { t: 'Get your confirmation by text,', d: 'with the address and what to bring.' },
    { t: 'Walk in wearing comfortable athletic clothes.', d: '', pending: PENDING.gi },
    { t: 'The coach walks you through every move.', d: 'You train at your own pace.' },
  ] as { t: string; d: string; pending?: string }[],
  talk: 'Prefer to talk first? Call',
}

// ── the coach ──
export const COACH = {
  eyebrow: 'Head coach & owner',
  title: { a: 'He studied ', b: 'how kids learn', c: ' before he taught them to fight.' },
  body: "Professor Cristyan has trained Jiu-Jitsu since 1999 and has been a black belt for 17 years, under Rodrigo Feijão (Clube Feijão / Nova União). He holds a degree in Physical Education and a postgraduate degree in Jiu-Jitsu, and taught for nearly 10 years in Brazil before opening his academy in Hyannis. That's where the age-group method comes from: classes built around how children move and develop at each age.",
  stats: [{ n: '1999', l: 'Training since' }, { n: '4th', l: 'Degree black belt' }, { n: '5,000', l: 'Sq ft academy' }],
  cta: 'Train with Cristyan, free',
  cutout: img('prof_cut', 'Professor Cristyan Martins in his gi and black belt, arms crossed'),
}

// ── gallery: the real photos are pending; the site's own photos stand in, each slot names the shot it waits for ──
export const GALLERY = {
  title: { a: 'Real students. Real mat. ', b: 'Hyannis.' },
  shots: [
    { photo: img('kids_1', 'The kids classes lined up on the mat in front of the academy logo'), want: 'Pendente: turmas kids por idade' },
    { photo: img('kids_2', 'A coach correcting a young student on the mat'), want: 'Pendente: professor corrigindo aluno' },
    { photo: img('adult_1', 'Adult students lined up on the mat'), want: 'Pendente: adultos na Novice' },
    { photo: img('about_hero', 'The training floor with grey mats and the Cristyan logo on the wall'), want: 'Pendente: o espaço novo de 5.000 sq ft' },
  ],
}

// ── what parents say (Google, verbatim as approved) ──
export const VOICES = {
  title: { a: 'What parents ', b: 'say.' },
  badge: { rating: '5.0', count: 131 },
  reviews: [
    { text: 'A fantastic experience for my 6-year-old daughter and 4-year-old son, offering structured, professional instruction.', name: 'Shamus Kelley' },
    { text: "If you're looking to build confident kids, Cristyan BJJ Academy is exceptional. Coach and team know exactly how to mentor, discipline and have fun at the same time.", name: 'Daniel Eldridge' },
    { text: "The best place to get yourself or kids started. You couldn't ask for a better instructor/leader than Cristyan.", name: 'Steven Kane' },
  ],
}

// ── weekly schedule (approved copy; times are PM) ──
export type LpClass = { at: string; name: string; adult?: boolean; kind: 'kids' | 'adults' | 'other'; ages?: string }
const K = (at: string, name: string, ages: string): LpClass => ({ at, name, kind: 'kids', ages })
const A = (at: string, name: string): LpClass => ({ at, name, kind: 'adults', adult: true })
const BOX: LpClass = { at: '5:30', name: 'Box Fitness', kind: 'other' }
const MON: LpClass[] = [K('4:30', 'Little', 'Ages 6–8'), K('5:30', 'Youth', 'Ages 9–11'), BOX, A('6:45', 'Intermediate')]
const TUE: LpClass[] = [K('4:30', 'Tiny', 'Ages 4–6'), K('5:30', 'Junior', 'Ages 12–15'), A('6:45', 'Novice'), A('8:00', 'Advanced Gi')]
export const WEEK = {
  title: { a: 'Weekly ', b: 'schedule.' },
  days: [
    { k: 'Mon', long: 'Monday', classes: MON },
    { k: 'Tue', long: 'Tuesday', classes: TUE },
    { k: 'Wed', long: 'Wednesday', classes: [K('4:30', 'Little No-Gi', 'Ages 6–8'), K('5:30', 'Youth No-Gi', 'Ages 9–11'), BOX, K('6:45', 'Junior No-Gi', 'Ages 12–15'), A('8:00', 'Advanced No-Gi')] },
    { k: 'Thu', long: 'Thursday', classes: TUE },
    { k: 'Fri', long: 'Friday', classes: MON },
    { k: 'Sat & Sun', long: 'Saturday and Sunday', classes: [] },
  ] as { k: string; long: string; classes: LpClass[] }[],
  closed: 'closed',
}

// ── parents train too ──
export const SAME_HOUR = {
  tag: 'Parents train too',
  title: { a: 'Your kid trains. You train. ', b: 'Same hour.' },
  body: 'Youth BJJ and Box Fitness both run Mon, Wed & Fri at 5:30 PM. Drop your child on the mat and train in the next class instead of waiting in the car.',
  cta: 'Book a family trial',
  // Youth BJJ is 9 to 11: kids that age, not the toddlers of Tiny (Adryan, 16/11)
  kid: { photo: img('boston_fall_open_2026_kids', 'Youth students of the academy in their gis with their medals'), label: 'Youth BJJ' },
  you: { photo: img('box_1', 'Box Fitness students in their stance in front of the heavy bags'), label: 'Box Fitness' },
  time: '5:30 PM', days: 'Mon, Wed & Fri',
}

// ── FAQ ──
export const LP_FAQ = {
  title: { a: 'Before your ', b: 'first class.' },
  items: [
    { q: 'Is it safe for my 4-year-old?', a: 'There are no punches or kicks in Jiu-Jitsu, and Tiny BJJ is only for ages 4 to 6, in 45-minute classes. Your child never trains with the big kids.' },
    { q: 'Will Jiu-Jitsu make my child aggressive?', a: "It does the opposite. Kids learn to control a situation without hurting anyone, and why they'll almost never need to." },
    { q: "I've never trained and I'm out of shape. Is that okay?", a: "That's who Novice BJJ is for. Drills and core technique, no free sparring, twice a week. You get in shape by training, not before." },
    { q: 'My son is 13. Which class is his?', a: 'Junior BJJ, for ages 12 to 15. From 16, he moves to the adult classes.' },
    { q: 'Do I have to compete?', a: 'No. About 95% of our students train for self-defense, health and friendship, not medals.' },
    { q: 'What do I wear?', a: 'Comfortable athletic clothes with no zippers or pockets.', pending: PENDING.gi },
    { q: 'How much is membership?', a: "It depends on the program and how many days a week you train. We'll walk you through it in person after your free class. No pressure." },
  ] as { q: string; a: string; pending?: string }[],
}

export const LP_CLOSE = {
  title: { a: 'Come meet the coach. ', b: 'Your first class is free.' },
  photo: img('about_2', 'The whole academy, kids and adults, together on the mats'),
  micro: 'Call or text',
}

export const LP_FOOT = {
  academy: 'Cristyan Brazilian Jiu-Jitsu Academy',
  directions: 'Get directions',
  also: { label: 'Also at the academy', items: ['Box Fitness', 'Capoeira', 'Judo (12+)'] },
  photo: img('space_1', 'The front of Cristyan Jiu-Jitsu on Iyannough Rd'),
}

/** The booking form's texts on this page (the kit's panel): only facts of the approved copy, so the
 *  form never promises what is still pending (the site's own panel says the kimono is lent). */
export const LP_BOOK_COPY = {
  panelText: 'Pick your class, day and time. It takes under a minute.',
  bullets: ['No experience needed', 'No card on file', 'Taught by a 4th-degree black belt'],
  tips: ['Comfortable athletic clothes with no zippers or pockets'],
}
