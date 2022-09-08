import { useMemo } from "react";
import * as HiIcons from "react-icons/hi";
import { IconType } from "react-icons/lib";

import { NoOp } from "@utils/functions";

/**
 * An easy to use hook for importing an SVG icon into a component. Internally it uses
 * Hero Icons package from `react-icons` (distributed via MIT license).
 *
 * TODO: Add other packages with MIT license
 */
export const useIcon = (name?: keyof typeof HiIcons): IconType => {
  const Icon = useMemo(() => {
    if (!name) return NoOp;

    const Icon = HiIcons[name];

    return Icon ?? NoOp;
  }, [name]);

  return Icon as IconType;
};
