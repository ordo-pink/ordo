import { useDraggable, useDroppable } from "@dnd-kit/core"
import { OrdoDirectoryDTO, IconSize } from "@ordo-pink/common-types"
import { useContextMenu, useCommands, DirectoryIcon } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

type Props = {
  directory: OrdoDirectoryDTO
}

export default function FSActivityDirectory({ directory }: Props) {
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()
  const { t } = useTranslation("fs")

  const { setNodeRef, listeners, attributes } = useDraggable({
    id: directory.path,
    data: directory,
  })

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: directory.path,
    data: directory,
  })

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    showContextMenu({
      x: e.pageX,
      y: e.pageY,
      target: directory,
    })
  }

  const handleClick = () => {
    emit("router.navigate", `/fs${directory.path}`)
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`select-none flex flex-col items-center p-2 h-max rounded-lg ring-0 cursor-pointer ring-pink-500 hover:ring-1 hover:bg-pink-500/10 ${
        isOver ? "ring-neutral-500 ring-1 bg-neutral-500/10" : ""
      }`}
      key={directory.path}
      title={directory.path}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div
        className={`text-6xl`}
        ref={setDroppableNodeRef}
      >
        <DirectoryIcon
          directory={directory}
          size={IconSize.LARGE}
        />
      </div>
      <p className="truncate w-[100px] text-center">{t(directory.readableName)}</p>
    </div>
  )
}
