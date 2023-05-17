import { OrdoDirectoryDTO, IconSize } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import {
  AiFillFolderOpen,
  AiOutlineFolderOpen,
  AiFillFolder,
  AiOutlineFolder,
} from "react-icons/ai"
import { BsFolder, BsFolderFill, BsStarFill, BsTrash2, BsTrash2Fill } from "react-icons/bs"
import { Null } from "../null/null"

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
  directory: OrdoDirectoryDTO
  size: IconSize
  showExpansion?: boolean
}

export const DirectoryIcon = ({ directory, showExpansion, size }: Props) => {
  const hasChildren = directory && directory.children && directory.children.length > 0

  let iconSwitch = Switch.of(directory)
    .case(
      (dir) => dir.path === "/.trash/" && !hasChildren,
      () => BsTrash2,
    )
    .case(
      (dir) => dir.path === "/.trash/" && hasChildren,
      () => BsTrash2Fill,
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
        {directory.metadata.isFavourite ? (
          <div
            className={`absolute text-lg bottom-[calc(100%-50%-0.6rem)] left-[calc(100%-50%-0.6rem)] ${
              directory.metadata.colour && directory.metadata.colour !== "neutral"
                ? iconColors[directory.metadata.colour]
                : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            <BsStarFill className="" />
          </div>
        ) : (
          <div
            className={`absolute p-2 w-4 bottom-[calc(100%-50%-0.6rem)] left-[calc(100%-50%-0.55rem)] rounded-full ${
              directory.metadata.colour && directory.metadata.colour !== "neutral"
                ? backgroundColors[directory.metadata.colour ?? ""]
                : ""
            }`}
          />
        )}
      </div>
    ))
    .default(() => (
      <Icon className={iconColors[directory.metadata.colour ?? ""] ?? iconColors["neutral"]} />
    ))
}
