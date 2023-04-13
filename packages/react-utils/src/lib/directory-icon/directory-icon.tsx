import { IOrdoDirectory } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import {
  AiFillFolderOpen,
  AiOutlineFolderOpen,
  AiFillFolder,
  AiOutlineFolder,
} from "react-icons/ai"
import { BsFolder, BsFolderFill, BsTrash3, BsTrash3Fill } from "react-icons/bs"
import { Null } from "../null/null"

export enum IconSize {
  EXTRA_SMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  EXTRA_LARGE = "xl",
  TILE = "2xl",
}

export const iconColors: Record<string, string> = {
  neutral: "icon-neutral",
  pink: "icon-pink",
  red: "icon-red",
  orange: "icon-orange",
  yellow: "icon-yellow",
  green: "icon-green",
  blue: "icon-blue",
  purple: "icon-purple",
}

export const backgroundColors: Record<string, string> = {
  neutral: "bg-neutral",
  pink: "bg-pink",
  red: "bg-red",
  orange: "bg-orange",
  yellow: "bg-yellow",
  green: "bg-green",
  blue: "bg-blue",
  purple: "bg-purple",
}

type Props = {
  directory: IOrdoDirectory
  size: IconSize
  showExpansion?: boolean
}

export const DirectoryIcon = ({ directory, showExpansion, size }: Props) => {
  const hasChildren = directory && directory.children && directory.children.length > 0

  let iconSwitch = Switch.of(directory)
    .case(
      (dir) => dir.path === "/.trash/" && !hasChildren,
      () => BsTrash3,
    )
    .case(
      (dir) => dir.path === "/.trash/" && hasChildren,
      () => BsTrash3Fill,
    )

  if (showExpansion) {
    iconSwitch = iconSwitch
      .case(
        (dir) => hasChildren && !!dir.metadata.isExpanded,
        () => AiFillFolderOpen,
      )
      .case(
        (dir) => hasChildren && !dir.metadata.isExpanded,
        () => AiFillFolder,
      )
      .case(
        (dir) => !hasChildren && !!dir.metadata.isExpanded,
        () => AiOutlineFolderOpen,
      )
      .case(
        (dir) => !hasChildren && !dir.metadata.isExpanded,
        () => AiOutlineFolder,
      )
  } else {
    iconSwitch = iconSwitch
      .case(
        () => hasChildren,
        () => BsFolderFill,
      )
      .case(
        () => !hasChildren,
        () => BsFolder,
      )
  }

  const Icon = iconSwitch.default(() => Null)

  return Switch.of(size)
    .case(IconSize.LARGE, () => (
      <div className="relative">
        <Icon className={` ${iconColors["neutral"]}`} />
        <div
          className={`absolute p-2 w-4 bottom-0.5 rounded-full shadow-md ${
            directory.metadata.color && directory.metadata.color !== "neutral"
              ? backgroundColors[directory.metadata.color ?? ""]
              : ""
          }`}
        />
      </div>
    ))
    .default(() => (
      <Icon className={iconColors[directory.metadata.color ?? ""] ?? iconColors["neutral"]} />
    ))
}
