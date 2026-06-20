'use client';
/**
 * App-shell page transition wrapper. Next.js remounts `template.tsx` on every
 * navigation, so this gives each route a choreographed entrance: the page lifts
 * + un-blurs as a whole, and its top-level blocks (header, cards, tables)
 * cascade in with a staggered blur-rise. Pure CSS — see `.page-enter` in globals.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
