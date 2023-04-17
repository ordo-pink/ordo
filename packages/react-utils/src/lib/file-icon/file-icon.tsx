import { IOrdoFile, IconSize } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { memo } from "react"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { backgroundColors } from "../directory-icon/directory-icon"
import { useFileAssociationFor } from "../hooks/use-file-asssociation"

type Props = {
  file: IOrdoFile
  size: IconSize
}

export const FileIcon = memo(
  ({ file, size }: Props) => {
    const currentFileAssociation = useFileAssociationFor(file)
    const Icon = currentFileAssociation?.Icon ?? (() => <BsFileEarmarkBinary />)

    return Switch.of(size)
      .case(IconSize.LARGE, () => (
        <div className="relative">
          <div className="absolute bottom-0 right-1">
            <div
              className={`p-2 rounded-full ${
                file.metadata.colour && file.metadata.colour !== "neutral"
                  ? backgroundColors[file.metadata.colour ?? ""]
                  : ""
              }`}
            />
          </div>
          <Icon
            size={size}
            file={file}
          />
        </div>
      ))
      .default(() => (
        <Icon
          size={size}
          file={file}
        />
      ))
  },
  (prev, next) =>
    prev.file.path === next.file.path && prev.file.metadata.colour === next.file.metadata.colour,
)
