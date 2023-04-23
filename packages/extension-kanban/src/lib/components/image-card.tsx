import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import {
  Null,
  backgroundColors,
  useCommands,
  useContextMenu,
  useFileContentBlob,
} from "@ordo-pink/react-utils"
import { useEffect, useState } from "react"
import { Draggable } from "react-beautiful-dnd"

type Props = {
  file: IOrdoFile
  index: number
}

export default function ImageCard({ file, index }: Props) {
  const content = useFileContentBlob(file)
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

  const [url, setUrl] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (!content) {
      if (url) {
        URL.revokeObjectURL(url)
        setUrl(null)
      }

      return
    }

    const objectUrl = URL.createObjectURL(content)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [file, content])

  return Either.fromNullable(url).fold(Null, (url) => (
    <Draggable
      draggableId={file.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            showContextMenu({
              target: file,
              x: e.pageX,
              y: e.pageY,
            })
          }}
          className={`transition-all duration-300 flex flex-col space-y-4 rounded-lg focus:ring-2 focus:ring-pink-500 ${
            snapshot.isDragging
              ? "bg-gradient-to-tr from-sky-200 dark:from-violet-700 via-slate-200 to-pink-200 dark:to-purple-700"
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="relative">
            <img
              className="rounded-lg"
              title={file.path}
              src={url}
              alt={file.readableName}
            />

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between">
              <div></div>
              <div
                className={`m-2 p-2 w-4 rounded-full cursor-pointer shadow-inner ${
                  file.metadata.colour && file.metadata.colour !== "neutral"
                    ? backgroundColors[file.metadata.colour ?? ""]
                    : ""
                }`}
                onClick={() => emit("fs.change-file-colour", file)}
              />
            </div>
          </div>

          {/* TODO: Display action buttons on mobile */}
          {/* <div className="flex justify-end">
              <OrdoButtonSecondary
                compact
                onClick={() =>
                  dispatch(
                    showRenameFileModal({
                      target: file,
                      parent: findParent(file, tree) as IOrdoDirectory,
                      openOnRename: false,
                    }),
                  )
                }
              >
                <BsPencilSquare />
              </OrdoButtonSecondary>

              <OrdoButtonSecondary
                compact
                onClick={() =>
                  navigate({
                    pathname: "/editor",
                    search: createSearchParams({ path: file.path }).toString(),
                  })
                }
              >
                <BsArrowsFullscreen />
              </OrdoButtonSecondary>
            </div> */}
        </div>
      )}
    </Draggable>
  ))
}
