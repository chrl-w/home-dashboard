# Personal OS → Radix Themes — component map

Build screens from **Radix Themes** components; the Personal OS theme brands them.
This maps the design-system primitives to their Radix Themes equivalent and the
prop conventions to use.

## Conventions
- **Appearance / accent / gray / radius** are set globally by `AreaProvider` — never
  set `appearance` or per-component `color` unless you deliberately want to break the
  area accent (e.g. a `red` destructive action or a `gray` quiet control).
- **Radius**: the brand default is `radius="large"` (set on the Theme). Don't override
  per component.
- **Sizes**: default to `size="2"` for controls in dense UI, `size="3"` for primary
  page actions. Headings use Radix `size` 6–9 for display.
- **One primary action per view** — a single solid `<Button>`; everything else is
  `variant="soft"`, `"surface"`, or `"ghost"`.

## Map

| Personal OS | Radix Themes | Notes |
|---|---|---|
| Button (primary) | `<Button>` (solid) | Add `className="pos-glow"` for the signature halo on key CTAs. |
| Button (secondary) | `<Button variant="soft">` | Quiet fill. |
| Button (ghost) | `<Button variant="ghost">` | |
| Button (outline) | `<Button variant="surface">` | |
| Button (destructive) | `<Button color="red">` | Overrides area accent intentionally. |
| IconButton | `<IconButton>` | Lucide glyph child, `strokeWidth={1.75}`. |
| Input | `<TextField.Root>` (+ `<TextField.Slot>` for icons) | |
| Textarea | `<TextArea>` | |
| Select | `<Select.Root>` / `Trigger` / `Content` / `Item` | |
| Checkbox | `<Checkbox>` | |
| RadioGroup | `<RadioGroup.Root>` / `Item` | |
| Switch | `<Switch>` | |
| Badge | `<Badge>` | `color="green|orange|red"` for success/warning/danger signals. |
| Card | `<Card>` | Theme uses `panelBackground="solid"` → solid brand card surface. |
| Avatar | `<Avatar>` | `fallback` for initials. |
| Progress | `<Progress>` | |
| Separator | `<Separator>` | |
| Alert / Callout | `<Callout.Root>` / `Icon` / `Text` | `color` = signal. |
| Tooltip | `<Tooltip>` | |
| Dialog | `<Dialog.Root>` / `Content` … | Add `className="pos-glow-lg"` on `Dialog.Content` for the brand glow. |
| Tabs | `<Tabs.Root>` / `List` / `Trigger` | |
| Accordion | (Radix Themes has no Accordion) use `@radix-ui/react-accordion` primitive, styled with `--gray-*` / `--accent-*`. |
| Segmented control / Area switcher | `<SegmentedControl.Root>` | See `patterns/area-switcher.tsx`. |

## Display & text
- Hero: `<Heading className="pos-display">Today in <em>Work.</em></Heading>` — the `<em>`
  gets the italic-gradient accent phrase.
- Eyebrow: `<Text className="pos-eyebrow">Work · Dashboard</Text>`.
- Body: `<Text size="2" color="gray">…</Text>`. Numbers/kbd: `<Code>` or
  `font-family: var(--code-font-family)` (DM Mono).

## Example: a branded card

```tsx
import { Card, Flex, Heading, Text, Button, Badge } from "@radix-ui/themes";

<Card size="3">
  <Text className="pos-eyebrow">Work · Today</Text>
  <Heading className="pos-display" size="7" mt="1">
    Finish the <em>proposal deck.</em>
  </Heading>
  <Flex align="center" gap="2" mt="3">
    <Badge color="orange">Due 4:00 PM</Badge>
    <Button className="pos-glow" ml="auto">Start focus</Button>
  </Flex>
</Card>
```
