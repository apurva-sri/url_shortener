# LinkPilot Frontend — Phase 1: Foundation

## What's in this phase
- `tailwind.config.js` — your brand tokens (ink/slate/mist/paper + accent #6366F1), Poppins for display, Inter for body.
- `src/styles/variables.css` + `globals.css` — CSS vars, font import, reduced-motion handling.
- `src/components/layout/Navbar/Navbar.jsx` — Oxzeen-style navbar: centered pill nav where a black capsule glides between links on hover (Framer Motion `layoutId`), logo left, theme toggle + auth actions right.
- `src/components/landing/Marquee/Marquee.jsx` — Realrun-style infinite drifting strip, repurposed to scroll your core features instead of client logos.

## Install these (not yet in your stack list, needed for the above)
```
npm install lucide-react
```
You already planned framer-motion, react-router, and Tailwind — this just adds icons.

## Before running
1. Drop your logo mark (the black "lp" paper-plane icon) as an SVG at `public/logo/linkpilot-mark.svg`.
2. Wire `tailwind.config.js` into your Vite project root (replace the generated one).
3. Import `src/styles/globals.css` once in `main.jsx`.
4. Wrap your landing page: `<Navbar />` then `<Hero />` then `<Marquee />` sits naturally as a divider between Hero and Features, like Realrun uses it above their "Trusted by" logos.

## Design decisions worth flagging
- Nav links point to on-page anchors (`/#features` etc.) since this is a marketing landing page pattern — swap for real routes once those pages exist.
- The pill indicator uses `layoutId`, so if you later add a second nav (e.g. dashboard sidebar) reusing the same `layoutId` string will cause cross-talk — keep it scoped to this component.
- Marquee pauses to 60s (near-stop) on hover rather than a hard pause, so it doesn't visually jerk.

## Next phase options
- Hero section (with the paper-plane logo motif as a signature visual element)
- Auth pages (Register → OTP → Login) wired to your `/api/auth/*` endpoints
- Dashboard shell (Sidebar + DashboardLayout) with overview cards

Tell me which you want next.
