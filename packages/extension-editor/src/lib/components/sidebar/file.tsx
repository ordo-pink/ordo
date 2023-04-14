import { IOrdoFile, IconSize } from "@ordo-pink/common-types"
import {
  ActionListItem,
  FileIcon,
  useCommands,
  useContextMenu,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { MouseEvent } from "react"

type Props = {
  file: IOrdoFile
  isSelected?: boolean
}

export default function File({ file, isSelected }: Props) {
  const { emit } = useCommands()
  const { showContextMenu } = useContextMenu()
  const { filePath } = useRouteParams<"filePath">()

  const depth = file.path.split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`
  const isCurrent = isSelected ?? Boolean(filePath && `/${filePath}` === file.path)

  const handleClick = () => emit("editor.open-file-in-editor", file.path)

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    showContextMenu({ x: event.pageX, y: event.pageY, target: file })
  }

  const name =
    file.extension === ".md" ? file.readableName : `${file.readableName}${file.extension}`

  return (
    <div className="rounded-md z-50 transition-all duration-300 select-none">
      <ActionListItem
        style={{ paddingLeft }}
        text={name}
        Icon={() => (
          <FileIcon
            size={IconSize.EXTRA_SMALL}
            file={file}
          />
        )}
        isCurrent={isCurrent}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      />
    </div>
  )
}
