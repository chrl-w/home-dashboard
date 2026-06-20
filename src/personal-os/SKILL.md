---
name: personal-os-design
description: Use when building or styling interfaces for Personal OS — a dark-first, three-area (Work/Pets/Home) personal-workspace product built on Radix Themes. Provides the Radix Themes theme config, per-area brand palettes, fonts, glow utilities, and React helpers (AreaProvider, AreaSwitcher). Use for production React code or throwaway prototypes/mocks.
license: Internal
---

# Personal OS — design skill (Radix Themes)

Personal OS is **dark-first** (no light mode) and organised into three *areas* —
**Work** (teal), **Pets** (amber), **Home** (plum). The signature move is adaptive
theming: switching area re-skins every component. The base component library is
**[Radix Themes](https://www.radix-ui.com/themes)** — do **not** hand-roll buttons,
inputs, dialogs etc. Use Radix Themes components and let this skill's theme do the
branding.

## Start here
1. Read `README.md` for install + setup (it's a 3-import + one-provider job).
2. Read `COMPONENTS.md` for the Personal OS → Radix Themes component map and the
   brand prop conventions (sizes, radius, when to glow).
3. Skim `BRAND.md` for voice, type, colour, motion, and iconography rules.

## Files
- `theme/personal-os.css` — Radix Themes theme config: per-area accent/gray/background
  overrides (exact brand hexes), font remap, glow + eyebrow + display utilities.
- `theme/fonts.css` — Fraunces / DM Sans / DM Mono (Google Fonts).
- `theme/area-provider.tsx` — `<AreaProvider>` + `useArea()`. Wraps the app in a
  configured Radix `<Theme>` and switches area.
- `patterns/area-switcher.tsx` — `<AreaSwitcher>` recipe (Radix SegmentedControl).

## How to work
- **Production code**: install `@radix-ui/themes` + `lucide-react`, import the three
  stylesheets, wrap with `<AreaProvider>`, build screens from Radix Themes components.
- **Prototypes / mocks / slides**: produce static HTML. You can still load Radix Themes
  from CDN, or approximate with the CSS variables in `theme/personal-os.css`. Copy the
  fonts + glow utilities; use Lucide for icons.

If invoked with no brief, ask what the user wants to build, ask a few questions, then
act as an expert Personal OS designer and output Radix-Themes React code or static HTML.
