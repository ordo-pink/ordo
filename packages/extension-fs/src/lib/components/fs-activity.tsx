import {
  Active,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { IOrdoDirectory, IOrdoFile, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { Null, useCommands, useContextMenu, useDrive, useRouteParams } from "@ordo-pink/react-utils"
import { MouseEvent, useEffect, useState } from "react"
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"
import FSActivityActionsOverlay from "./fs-activity-actions-overlay"
import FSActivityDirectory from "./fs-activity-directory"
import FSActivityFile from "./fs-activity-file"

export default function FSActivity() {
  const drive = useDrive()
  const { path } = useRouteParams<"path">()
  const { emit } = useCommands()
  const { showContextMenu } = useContextMenu()
  const { t } = useTranslation("fs")

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  })

  const keyboardSensor = useSensor(KeyboardSensor, {})

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  const [currentDirectory, setCurrentDirectory] = useState<Nullable<IOrdoDirectory>>(null)
  const [activeDraggable, setActiveDraggable] = useState<Nullable<Active>>(null)

  useEffect(() => {
    if (!drive) return setCurrentDirectory(null)
    if (!path) return setCurrentDirectory(drive.root)

    setCurrentDirectory(
      OrdoDirectory.findDirectoryDeep(`/${path}` as OrdoDirectoryPath, drive.root),
    )
  }, [path, drive])

  const tRoot = t("root")
  const tFs = t("fs")

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    showContextMenu({
      x: e.pageX,
      y: e.pageY,
      target: currentDirectory,
    })
  }

  return Either.fromNullable(currentDirectory).fold(Null, (root) => (
    <div
      className={`h-full w-full`}
      onContextMenu={handleContextMenu}
    >
      <Helmet title={` ${root.readableName || tRoot} (${tFs})`} />

      <div
        className={`p-4 flex flex-wrap items-center md:items-start justify-center md:justify-start`}
      >
        <DndContext
          autoScroll
          sensors={sensors}
          onDragEnd={(event) => {
            setActiveDraggable(null)

            if (event.over && event.over.id === "action.remove") {
              const isOrdoDirectory = OrdoDirectory.isOrdoDirectory(event.active.data.current)

              emit(
                isOrdoDirectory ? "fs.move-directory-to-trash" : "fs.move-file-to-trash",
                event.active.data.current,
              )

              return
            }

            if (event.over && event.over.id === "action.send-to-parent") {
              if (!drive) return

              const isOrdoDirectory = OrdoDirectory.isOrdoDirectory(event.active.data.current)

              const parent = isOrdoDirectory
                ? OrdoDirectory.findParent(
                    (event.active.data.current as IOrdoDirectory).path,
                    drive.root,
                  )
                : OrdoFile.findParent((event.active.data.current as IOrdoFile).path, drive.root)

              if (!parent || parent.path === "/") return

              const parentParent = OrdoDirectory.findParent(parent.path, drive.root)

              if (!parentParent) return

              const draggableItem = event.active.data.current as IOrdoDirectory | IOrdoFile

              const command = isOrdoDirectory ? "fs.move-directory" : "fs.move-file"
              const payload = {
                oldPath: event.active.id,
                newPath: isOrdoDirectory
                  ? `${parentParent.path}${draggableItem.readableName}/`
                  : `${parentParent.path}${draggableItem.readableName}${
                      (draggableItem as IOrdoFile).extension
                    }`,
              }

              emit(command, payload)

              return
            }

            if (!event.over || event.active.id === event.over.id) {
              return
            }

            const draggableItem = event.active.data.current as IOrdoDirectory | IOrdoFile

            const isOrdoDirectory = OrdoDirectory.isOrdoDirectory(draggableItem)
            const command = isOrdoDirectory ? "fs.move-directory" : "fs.move-file"
            const payload = {
              oldPath: event.active.id,
              newPath: isOrdoDirectory
                ? `${event.over.id}${draggableItem.readableName}/`
                : `${event.over.id}${draggableItem.readableName}${
                    (draggableItem as IOrdoFile).extension
                  }`,
            }

            emit(command, payload)
          }}
          onDragStart={(event) => {
            setActiveDraggable(event.active)
          }}
        >
          {root.children.map((child) =>
            OrdoDirectory.isOrdoDirectory(child) ? (
              <FSActivityDirectory
                key={child.path}
                directory={child}
              />
            ) : (
              <FSActivityFile
                key={child.path}
                file={child}
              />
            ),
          )}

          <DragOverlay dropAnimation={null}>
            {activeDraggable ? (
              OrdoDirectory.isOrdoDirectory(activeDraggable.data.current) ? (
                <FSActivityDirectory
                  key={activeDraggable.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  directory={activeDraggable.data.current}
                />
              ) : (
                <FSActivityFile
                  key={activeDraggable.id}
                  file={activeDraggable.data.current as IOrdoFile}
                />
              )
            ) : null}
          </DragOverlay>

          <FSActivityActionsOverlay active={activeDraggable} />
        </DndContext>
      </div>
    </div>
  ))
}
