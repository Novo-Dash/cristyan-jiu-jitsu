/** An open point the client still has to confirm (src/data/lp.ts PENDING): a dashed placeholder where its
 *  text or media will go, never invented copy. Remove it once the answer is in. */
export function Pending({ children, block, dark }: { children: string; block?: boolean; dark?: boolean }) {
  return <span className={`pend${block ? ' pend--b' : ''}${dark ? ' pend--d' : ''}`} data-pending="">{children}</span>
}
