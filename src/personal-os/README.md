# Personal OS — Claude Code setup (Radix Themes)

Dark-first, three-area (Work / Pets / Home) workspace styling layered on
**Radix Themes**. This package is the theme + helpers; the components are Radix
Themes' own.

## 1. Install

```bash
npm install @radix-ui/themes lucide-react
```

## 2. Copy this folder into your repo

Drop `personal-os/` somewhere like `src/personal-os/` (or `.claude/skills/personal-os/`
to use it as an agent skill).

## 3. Import the styles — order matters

```ts
// app entry (e.g. main.tsx / app/layout.tsx)
import "@radix-ui/themes/styles.css";   // 1. Radix Themes base
import "./personal-os/theme/fonts.css"; // 2. Fraunces / DM Sans / DM Mono
import "./personal-os/theme/personal-os.css"; // 3. Personal OS overrides
```

> Do **not** also render `<Theme>` yourself — `AreaProvider` renders it for you.

## 4. Wrap your app

```tsx
import { AreaProvider } from "./personal-os/theme/area-provider";

export default function App() {
  return (
    <AreaProvider area="work">
      <YourApp />
    </AreaProvider>
  );
}
```

That renders `<Theme appearance="dark" accentColor="teal" grayColor="sage" radius="large">`
and stamps `.pos-area-work` so the exact brand palette applies.

## 5. Switch areas (the signature move)

```tsx
import { AreaSwitcher } from "./personal-os/patterns/area-switcher";
import { useArea } from "./personal-os/theme/area-provider";

// drop the ready-made switcher anywhere:
<AreaSwitcher />

// …or drive it yourself:
const { area, setArea } = useArea();
setArea("pets"); // whole UI re-skins teal → amber → plum
```

## 6. Build with Radix Themes components

```tsx
import { Button, Card, TextField, Badge, Dialog, Flex, Heading, Text } from "@radix-ui/themes";

<Card>
  <Heading size="5">Today in Work</Heading>
  <Text color="gray" size="2">3 open tasks.</Text>
  <Flex gap="2" mt="3">
    <Button>Add task</Button>
    <Button variant="soft">Snooze</Button>
  </Flex>
</Card>
```

Everything picks up the active area's accent, gray, background, and radius
automatically. See `COMPONENTS.md` for the full map and conventions.

## Brand utilities (added on top of Radix Themes)

| Class | Use |
|---|---|
| `pos-glow` / `pos-glow-sm` / `pos-glow-lg` | Area-coloured halo (the signature). |
| `pos-eyebrow` | Mono uppercase label above a heading. |
| `pos-display` (+ `<em>` inside) | Fraunces hero; `<em>` gets the italic gradient phrase. |

CSS variables you can read in custom components: `--pos-accent` (area accent),
`--pos-success` `--pos-warning` `--pos-danger` (fixed signals), plus all Radix tokens
(`--accent-9`, `--gray-11`, `--color-panel-solid`, …).

## Notes & caveats
- **Fonts** load from Google Fonts. For offline/SSR, self-host or use `next/font`
  and remap `--default-font-family` / `--heading-font-family` / `--code-font-family`
  in `personal-os.css`.
- **Custom accents**: Pets/Work/Home use the closest built-in Radix accent
  (`bronze`/`teal`/`purple`) with `--accent-9/10/11/contrast` overridden to the exact
  brand hexes. If you need a *fully* regenerated 12-step scale, use the
  [Radix custom color tool](https://www.radix-ui.com/colors/custom) and paste the
  scale under each `.pos-area-*` block.
- **Icons**: Lucide, outline, ~1.75px stroke (`strokeWidth={1.75}`).
