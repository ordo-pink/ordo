import { useDraggable } from "@dnd-kit/core"
import { IOrdoFile, IconSize } from "@ordo-pink/common-types"
import { FileIcon, useCommands, useContextMenu } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"

type Props = {
  file: IOrdoFile
}

export default function FSActivityFile({ file }: Props) {
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

  const { setNodeRef, listeners, attributes } = useDraggable({
    id: file.path,
    data: file,
  })

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    showContextMenu({
      x: e.pageX,
      y: e.pageY,
      target: file,
    })
  }

  const handleClick = () => {
    emit("editor.open-file-in-editor", file.path)
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="select-none flex flex-col items-center p-2 rounded-lg ring-0 cursor-pointer ring-pink-500 hover:ring-1 hover:bg-pink-500/10"
      key={file.path}
      title={file.path}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div className="max-w-[6rem] h-16">
        <div className="text-6xl flex flex-col justify-center items-center h-full">
          <FileIcon
            size={IconSize.LARGE}
            file={file}
          />
        </div>
      </div>
      <p className="truncate w-[100px] text-center">{file.readableName}</p>
      <p className="text-neutral-500 text-xs">{file.readableSize}</p>
    </div>
  )
}
