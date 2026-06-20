# Personal OS — brand rules (condensed)

The full guide lives in the design-system project's `readme.md`. This is the
working summary for building in code.

## Voice & copy
- Calm, direct, **second-person** ("You have 3 open tasks. Next up — …").
- **Sentence case** everywhere except mono eyebrows/labels, which are UPPERCASE.
- Short. Task titles are imperative ("Refill prescription food"). One plain sentence
  for descriptions. Terse mono metadata ("Thu · 2:00 PM", "30 min · Routine").
- A little opinionated; state decisions as facts ("There's no light mode — that's a
  decision."). **No emoji** in product chrome.

## Colour
- **Dark-first, no light mode.** Three areas, each a full tinted dark palette:
  **Work** teal `#0CC4A0` · **Pets** amber `#D4882A` · **Home** plum `#8844CC`.
- Accent = primary fill, focus ring, selection, progress, glow. One primary per view.
- Fixed signals: success `#2EC882`, warning `#F0A030`, danger `#E85070` (Radix
  `green` / `orange` / `red` map closely).
- Gradients only on the accent, only for one italic-serif hero phrase. No blue-purple
  "AI" gradients, no full-bleed background gradients.

## Type
- **Fraunces** — serif display (headings, hero). Italic + semibold for the one
  accented phrase. Light weight (300) at large sizes, tight tracking.
- **DM Sans** — all body / UI.
- **DM Mono** — eyebrows, kbd, numbers, code; uppercase + wide tracking as a label.

## Surfaces, radius, borders
- Cards: solid brand surface, hairline `rgba(fg, .07)` border, **large radius**
  (set globally), generous padding, no shadow at rest. Hover: `-2px` lift + accent border.
- Controls/inputs: large radius. Pills/avatars/switches fully round.
- Structure comes from surface contrast, not heavy borders.

## Glow, shadow, motion
- **Glow is the signature** — soft area-coloured halo (`.pos-glow*`), not hard shadow.
  Dialogs combine deep elevation + glow (`.pos-glow-lg`).
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`. 150ms hover/press · 200ms transitions ·
  380ms entrances · 500ms area re-skin. Entrances fade-up. No infinite decorative loops.

## Interaction states
- Hover: solid → slight scale `1.01` + lighter; soft/ghost → fill. Links → accent.
- Press: solid scale `0.97`.
- Focus: 2px accent ring (Radix handles this from `--focus-9`).
- Disabled: opacity `0.4`.

## Iconography
- **Lucide**, outline, **1.75px stroke**, `currentColor`. 14–20px in UI.
- Muted by default; accent-tinted for primary/active. Brand mark = `sparkles` in an
  accent tile with a glow. No emoji, no custom icon set, no icon font.
