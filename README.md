Personal website for xemc.dev

Interactivity

  - src/app/page.tsx:1 keeps the route simple and delegates all motion to src/components/interactive-home.tsx:1 ("use client"), so routing/
    SEO stays straightforward.
  - Progressive enhancement is built in: desktop/fine pointer gating (src/components/interactive-home.tsx:110), reduced-motion support (src/
    components/interactive-home.tsx:64, src/app/page.module.css:351), and mobile transform fallback (src/app/page.module.css:312).
  - Reveal sequencing uses data-reveal-id + IntersectionObserver (src/components/interactive-home.tsx:132) plus CSS delay variables (src/
    components/interactive-home.tsx:86, src/app/page.module.css:18).

  Motion mechanics

  - Pointer parallax runs from a viewport-level pointermove listener and is rAF-throttled (src/components/interactive-home.tsx:181), then
    applied with translate3d for GPU-friendly movement (src/components/interactive-home.tsx:80, src/components/interactive-home.tsx:299).
  - Draggable windows use Pointer Events with pointer capture (src/components/interactive-home.tsx:215, src/components/interactive-
    home.tsx:267) and explicit drag clamps (src/components/interactive-home.tsx:51) to keep behavior controlled.

  Spotlight architecture

  - Spotlight is now global, not tied to page width: fixed layer in layout (src/app/layout.tsx:37) and styling in globals (src/app/
    globals.css:48).
  - The home component only updates CSS vars on :root (src/components/interactive-home.tsx:281) and resets them on unmount (src/components/
    interactive-home.tsx:290), which is a clean JS/CSS separation.

  Site structure

  - Shared shell (fonts, nav, background layers) lives in src/app/layout.tsx:1 + src/app/globals.css:1.
  - Home-specific interaction styles are in src/app/page.module.css:1.
  - Secondary routes stay lightweight (src/app/projects/page.tsx:1, src/app/blog/page.tsx:1, src/app/contact/page.tsx:1) with shared
    scaffold styles (src/app/entry.module.css:1).

Photography workflow

  - For image prep/upload automation used by `/photography`, see scripts/README.md.
