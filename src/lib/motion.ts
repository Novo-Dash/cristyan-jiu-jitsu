/**
 * Motion is on unless the visitor asked for less (html.still, set before paint by index.html).
 * Read inside effects only: on the server and in the first render the page is the motion layout.
 */
export const motionOK = () => typeof document !== 'undefined' && !document.documentElement.classList.contains('still')

/** Where the /lp scroll scenes run: desktop, and phones tall enough to hold a scene in one screen (Adryan, 16/11:
 *  the effects on mobile too). Shorter phones get each scene's flat version (FLAT). */
export const SCENE = '(min-width: 900px), (max-width: 899px) and (min-height: 740px)'
export const FLAT = '(max-width: 899px) and (max-height: 739px)'
