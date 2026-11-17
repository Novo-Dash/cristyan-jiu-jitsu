// ─────────────────────────────────────────────────────────────────────────────
// /lp · the landing page rebuilt from zero (Adryan, 16/11/2026: "refaça tudo do zero, a rota é /lp",
// same design system and level as the site). The visitor words are the approved copy of src/data/lp.ts;
// this file only adds what the new presentation needs: which photo each age group shows, the coach's
// facts split out of his approved bio, the objects of the four steps and the photo strip.
// No em dashes in visitor copy ("4–6" keeps its range dash).
// ─────────────────────────────────────────────────────────────────────────────
import { img } from './img'
import { AGES, HAPPENS } from './lp'
import { REVIEWS, SITE } from './site'

/** The age scene: every program the ruler lands on, with the photo it shows. */
export const AGE_SCENE = AGES.programs.filter((p) => p.id !== 'adv').map((p) => ({
  ...p,
  photo: {
    tiny: img('kids_2', 'A coach kneeling on the mat to teach two young students'),
    little: img('kids_1', 'Kids lined up on the mat before class'),
    youth: img('kids', 'The kids team of Cristyan Jiu-Jitsu in front of the academy logo'),
    junior: img('junior', 'The Junior class lined up arm in arm on the mat under the academy logo'),
    novice: img('adult_2', 'An adult class in blue, black and white gis in front of the academy logo'),
  }[p.id]!,
}))
export const AGE_ADV = AGES.programs.find((p) => p.id === 'adv')!

/** The four steps, each carried by an object (the booking, the text, the clothes, the mat). */
export const STEPS = HAPPENS.steps.map((s, i) => ({ ...s, kind: (['book', 'text', 'wear', 'mat'] as const)[i] }))
export const STEP_OBJ = {
  book: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], day: 1, rows: [{ at: '4:30 PM', name: 'Tiny BJJ', ages: 'Ages 4–6' }, { at: '5:30 PM', name: 'Junior BJJ', ages: 'Ages 12–15' }, { at: '6:45 PM', name: 'Novice BJJ', ages: 'Adults 16+' }] },
  text: { from: 'Cristyan Jiu-Jitsu', body: "You're booked: Tiny BJJ, Tuesday at 4:30 PM.", place: img('space_1', 'The front of Cristyan Jiu-Jitsu on Iyannough Rd'), addr: SITE.address.line, bring: 'What to bring: an athletic shirt, shorts or leggings. No zippers or pockets.' },
  wear: [{ icon: 'shirt', t: 'Athletic shirt' }, { icon: 'shorts', t: 'Shorts or leggings' }, { icon: 'nozip', t: 'No zippers or pockets' }] as const,
  free: 'Your first class · Free',
  mat: img('mission', 'Professor Cristyan smiling on the mat with the adult team behind him'),
}

/** The coach's facts, each one a line of his approved bio (src/data/lp.ts COACH.body). */
export const COACH_FACTS = {
  left: [{ n: '1999', t: 'Training Jiu-Jitsu since' }, { n: '17 years', t: 'A black belt, under Rodrigo Feijão' }, { n: '4th degree', t: 'Black belt' }],
  right: [{ n: 'Degree', t: 'In Physical Education' }, { n: 'Postgraduate', t: 'Degree in Jiu-Jitsu' }, { n: 'Nearly 10', t: 'Years teaching in Brazil before Hyannis' }],
}

/** "Real students. Real mat. Hyannis.": the academy's own photos, in the order the strip shows them. */
export const STRIP = [
  img('prof_1', 'Professor Cristyan with his family in their gis'),
  img('boston_fall_open_2026_kids', 'Kids from the academy with their medals'),
  img('women_team', "The women's team of Cristyan Jiu-Jitsu in front of the academy logo"),
  img('adult', 'Adult students of Cristyan Jiu-Jitsu in gis in front of the academy logo'),
  img('judo_team', 'The Judo class on the mat'),
  img('capoeira_1', 'A Capoeira class with Instructor Jhenifer'),
  img('about_hero', 'The training floor with grey mats and the Cristyan logo on the wall'),
]

// ── the reviews: the site's six plus more parents from the Google listing (Adryan, 16/11: "quero mais reviews").
// Verbatim from Google Maps, read 16/11/2026; first name + initial; the one dash in Yanka's text became a comma.
// 17/11 (Adryan): the longest ones out so the cards stay short; Shamus in his first sentence.
export const LP_REVIEWS = [
  { ...REVIEWS[0], text: 'A fantastic experience for my 6-year-old daughter and 4-year-old son, offering structured, professional instruction.' },
  REVIEWS[1],
  REVIEWS[2],
  REVIEWS[3],
  { text: 'We love this place! Both my daughter’s jiu-jitsu classes and my boxing fitness classes are amazing. The instructors are supportive, motivating, and create such a positive environment. Great workouts, great energy, and great people, highly recommend!', name: 'Yanka D.', meta: 'Parent' },
  REVIEWS[4],
  { text: "My son had been training bjj for 2.5 years with Cristyan bjj academy. He loves going to class and competition class. Can't say enough with the coaching he gets and the confidence my son has achieved. Bjj for life!", name: 'Carrie W.', meta: 'Parent' },
  REVIEWS[5],
]
