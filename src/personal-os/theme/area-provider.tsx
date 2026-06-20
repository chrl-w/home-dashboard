import * as React from "react";
import { Theme } from "@radix-ui/themes";

/**
 * Personal OS — AreaProvider
 * ---------------------------------------------------------------------------
 * Wraps your app (or any subtree) in a Radix <Theme> configured for one of the
 * three Personal OS areas. It:
 *   - sets the closest built-in `accentColor` + `grayColor` for the area,
 *   - forces dark appearance + large radius (the brand defaults),
 *   - stamps `.pos-area-<area>` on the Theme root so the exact brand-hex
 *     overrides in personal-os.css apply.
 *
 * Switch `area` and every Radix component re-skins (teal → amber → plum).
 *
 *   import { AreaProvider, useArea } from "./theme/area-provider";
 *
 *   <AreaProvider area="pets">
 *     <App />
 *   </AreaProvider>
 *
 * Read/!change the area anywhere below with useArea().
 */

export type Area = "work" | "pets" | "home";

type RadixAccent = "teal" | "bronze" | "purple";
type RadixGray = "sage" | "sand" | "mauve";

const AREA_THEME: Record<Area, { accentColor: RadixAccent; grayColor: RadixGray; label: string }> = {
  work: { accentColor: "teal",   grayColor: "sage",  label: "Work" },
  pets: { accentColor: "bronze", grayColor: "sand",  label: "Pets" },
  home: { accentColor: "purple", grayColor: "mauve", label: "Home" },
};

export const AREAS: Area[] = ["work", "pets", "home"];
export const areaLabel = (a: Area) => AREA_THEME[a].label;

interface AreaContextValue {
  area: Area;
  setArea: (a: Area) => void;
}
const AreaContext = React.createContext<AreaContextValue | null>(null);

export function useArea(): AreaContextValue {
  const ctx = React.useContext(AreaContext);
  if (!ctx) throw new Error("useArea must be used within an <AreaProvider>");
  return ctx;
}

export interface AreaProviderProps {
  /** Initial area. @default "work" */
  area?: Area;
  /** Controlled area — pass with onAreaChange to drive it externally. */
  value?: Area;
  onAreaChange?: (a: Area) => void;
  /** Extra props forwarded to the Radix <Theme>. */
  themeProps?: React.ComponentProps<typeof Theme>;
  children: React.ReactNode;
}

export function AreaProvider({
  area: initial = "work",
  value,
  onAreaChange,
  themeProps,
  children,
}: AreaProviderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Area>(initial);
  const area = isControlled ? (value as Area) : internal;

  const setArea = React.useCallback((a: Area) => {
    if (!isControlled) setInternal(a);
    onAreaChange?.(a);
  }, [isControlled, onAreaChange]);

  const t = AREA_THEME[area];

  return (
    <AreaContext.Provider value={{ area, setArea }}>
      <Theme
        appearance="dark"
        accentColor={t.accentColor}
        grayColor={t.grayColor}
        radius="large"
        panelBackground="solid"
        {...themeProps}
        className={`pos-area pos-area-${area}${themeProps?.className ? " " + themeProps.className : ""}`}
      >
        {children}
      </Theme>
    </AreaContext.Provider>
  );
}
