import * as React from "react";
import { SegmentedControl } from "@radix-ui/themes";
import { Briefcase, PawPrint, Building2 } from "lucide-react";
import { useArea, AREAS, areaLabel, type Area } from "../theme/area-provider";

/**
 * Personal OS — AreaSwitcher
 * A branded recipe: Radix Themes <SegmentedControl> wired to the area context.
 * Drop it in any header/sidebar to let the user re-skin the whole app.
 *
 *   <AreaSwitcher />
 */

const AREA_ICON: Record<Area, React.ReactNode> = {
  work: <Briefcase size={15} strokeWidth={1.75} />,
  pets: <PawPrint size={15} strokeWidth={1.75} />,
  home: <Building2 size={15} strokeWidth={1.75} />,
};

export function AreaSwitcher() {
  const { area, setArea } = useArea();
  return (
    <SegmentedControl.Root
      value={area}
      onValueChange={(v) => setArea(v as Area)}
      size="2"
      radius="large"
    >
      {AREAS.map((a) => (
        <SegmentedControl.Item key={a} value={a}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            {AREA_ICON[a]} {areaLabel(a)}
          </span>
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
