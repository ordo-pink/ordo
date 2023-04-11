import { IOrdoFile } from "@ordo-pink/common-types"
import { FileIcon, useCommands, useContextMenu } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"

type Props = {
  file: IOrdoFile
}

export default function FSActivityFile({ file }: Props) {
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

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
      className="flex flex-col items-center p-2 h-max rounded-lg ring-0 cursor-pointer ring-pink-500 hover:ring-1 hover:bg-pink-500/10"
      key={file.path}
      title={file.path}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div className="text-5xl">
        <FileIcon file={file} />
      </div>
      <p className="truncate w-[100px] text-center">{file.readableName}</p>
      <p className="text-neutral-500 text-xs">{file.readableSize}</p>
    </div>
  )
}
