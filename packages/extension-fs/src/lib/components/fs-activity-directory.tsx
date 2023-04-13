import { useDraggable, useDroppable } from "@dnd-kit/core"
import { IOrdoDirectory } from "@ordo-pink/common-types"
import { useContextMenu, useCommands } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { BsFillFolderFill, BsFolder } from "react-icons/bs"
import { iconColors } from "../colors"

type Props = {
  directory: IOrdoDirectory
}

export default function FSActivityDirectory({ directory }: Props) {
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

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
        className={`text-5xl`}
        ref={setDroppableNodeRef}
      >
        {directory && directory.children && directory.children.length > 0 ? (
          <BsFillFolderFill
            className={
              iconColors[(directory as IOrdoDirectory<{ color: string }>).metadata.color] ??
              iconColors["neutral"]
            }
          />
        ) : (
          <BsFolder
            className={
              iconColors[(directory as IOrdoDirectory<{ color: string }>).metadata.color] ??
              iconColors["neutral"]
            }
          />
        )}
      </div>
      <p className="truncate w-[100px] text-center">{directory.readableName}</p>
    </div>
  )
}
