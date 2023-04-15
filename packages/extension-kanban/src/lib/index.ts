import { OrdoDirectoryPath, IOrdoFile, CommandContext } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { BsKanban } from "react-icons/bs"
import { OrdoKanbanNode } from "./ordo-kanban/node"
import { ORDO_KANBAN_TRANSFORMER } from "./ordo-kanban/transformer"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

import "./index.css"

export default createExtension(
  "kanban",
  ({
    registerTranslations,
    registerActivity,
    registerEditorPlugin,
    registerCommandPaletteItem,
    commands,
    translate,
  }) => {
    registerTranslations({ ru, en })

    commands.on("open-kanban-board", ({ payload }) => {
      commands.emit("router.navigate", payload ? `/kanban${payload}` : "/kanban")
    })

    commands.after(
      "fs.move-directory.complete",
      ({ payload }: CommandContext<{ oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath }>) => {
        const [drive] = wieldDrive()
        const driver = wieldFsDriver()

        if (!drive || !driver) return

        const files = OrdoDirectory.getFilesDeep(drive.root) as IOrdoFile<{
          kanbans?: OrdoDirectoryPath[]
        }>[]

        files.forEach((file) => {
          if (file.metadata.kanbans && file.metadata.kanbans.includes(payload.oldPath)) {
            const updatedFile = OrdoFile.from({
              ...file,
              metadata: {
                ...file.metadata,
                kanbans: file.metadata.kanbans
                  .filter((kanban) => kanban !== payload.oldPath)
                  .concat([payload.newPath]),
              },
            })

            commands.emit("fs.update-file", updatedFile)

            driver.files
              .getContent(file.path)
              .then((res) => res.text())
              .then((content) => {
                commands.emit("fs.update-file-content", {
                  file: updatedFile,
                  content: content.replace(
                    `(((Kanban::${payload.oldPath})))`,
                    `(((Kanban::${payload.newPath})))`,
                  ),
                })
              })
          }
        })
      },
    )

    registerEditorPlugin("kanban-plugin", {
      nodes: [OrdoKanbanNode],
      transformer: ORDO_KANBAN_TRANSFORMER,
    })

    registerCommandPaletteItem({
      id: "kanban.open-board",
      name: translate("open-kanban"),
      Icon: BsKanban,
      onSelect: () => {
        const [drive] = wieldDrive()

        if (!drive) return

        hideCommandPalette()

        const kanbanFiles = OrdoDirectory.getFilesDeep(drive.root)
          .filter((file) => Boolean(file.metadata["kanbans"]))
          .reduce((acc, file) => {
            ;(file.metadata["kanbans"] as OrdoDirectoryPath[]).forEach((kanban) => {
              if (!acc[kanban]) {
                acc[kanban] = []
              }

              acc[kanban].push(file as unknown as IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>)
            })

            return acc
          }, {} as Record<OrdoDirectoryPath, IOrdoFile<{ kanbans: OrdoDirectoryPath[] }>[]>)

        showCommandPalette(
          Object.keys(kanbanFiles).map((key) => ({
            id: key,
            name: key.slice(1, -1),
            Icon: BsKanban,
            onSelect: () => {
              commands.emit("kanban.open-kanban-board", key)
              hideCommandPalette()
            },
          })),
        )
      },
    })

    registerCommandPaletteItem({
      id: "kanban.open-boards",
      name: translate("open-kanbans"),
      Icon: BsKanban,
      onSelect: () => {
        commands.emit("kanban.open-kanban-board")
        hideCommandPalette()
      },
    })

    registerActivity("board", {
      routes: ["/kanban", "/kanban/:board*"],
      Component: lazy(() => import("./components/component")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })
  },
)
