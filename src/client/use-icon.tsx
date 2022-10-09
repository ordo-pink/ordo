import { useMemo } from "react"
import { IconType } from "react-icons"
import * as HiIcons from "react-icons/hi"
import * as DiIcons from "react-icons/di"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as BsIcons from "react-icons/bs"

import Switch from "@core/utils/switch"

import Null from "@client/null"

const ALL_ICONS: Record<string, IconType> = {
  ...HiIcons,
  ...DiIcons,
  ...FaIcons,
  ...AiIcons,
  ...BsIcons,
}

export type IconName =
  | keyof typeof HiIcons
  | keyof typeof DiIcons
  | keyof typeof FaIcons
  | keyof typeof AiIcons
  | keyof typeof BsIcons

const isIconAvailable = (name?: IconName) => Boolean(name && ALL_ICONS[name])

/**
 * React hook that provides quick access to a desired icon. If the icon is not available,
 * or the name is not provided, returns a NoOp. Results are cached per icon name.
 */
export const useIcon = (name?: IconName): IconType => {
  const Icon = useMemo(() => {
    const iconThunk = Switch.of(name)
      .case(isIconAvailable, () => ALL_ICONS[name as string])
      .default(() => Null as unknown as IconType)

    return iconThunk()
  }, [name])

  return Icon
}
