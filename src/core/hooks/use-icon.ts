import { useMemo } from "react";
import { Switch } from "or-else";
import { IconType } from "react-icons/lib";
import * as HiIcons from "react-icons/hi";
import * as DiIcons from "react-icons/di";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

import { NoOp } from "@utils/functions";

const ALL_ICONS: Record<string, IconType> = {
  ...HiIcons,
  ...DiIcons,
  ...FaIcons,
  ...AiIcons,
  ...BsIcons,
};

export type IconName =
  | keyof typeof HiIcons
  | keyof typeof DiIcons
  | keyof typeof FaIcons
  | keyof typeof AiIcons
  | keyof typeof BsIcons;

const isIconAvailable = (name?: IconName) => Boolean(name && ALL_ICONS[name]);

/**
 * An easy to use hook for importing an SVG icon into a component. Internally it uses
 * Hero Icons package from `react-icons` (distributed via MIT license).
 */
export const useIcon = (name?: keyof typeof HiIcons): IconType => {
  const Icon = useMemo(() => {
    const iconThunk = Switch.of(name)
      .case(isIconAvailable, () => ALL_ICONS[name as string])
      .default(() => NoOp as unknown as IconType);

    return iconThunk();
  }, [name]);

  return Icon as IconType;
};
