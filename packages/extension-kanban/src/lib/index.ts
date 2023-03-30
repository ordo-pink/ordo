import { OrdoDirectoryPath, IOrdoFile } from "@ordo-pink/common-types"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$ } from "@ordo-pink/stream-drives"
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

    registerEditorPlugin("kanban-plugin", {
      nodes: [OrdoKanbanNode],
      transformer: ORDO_KANBAN_TRANSFORMER,
    })

    registerCommandPaletteItem({
      id: "kanban.open-board",
      name: translate("open-kanban"),
      Icon: BsKanban,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        hideCommandPalette()

        const kanbanFiles = drive.root
          .getFilesDeep()
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

    // TODO: Watch files for content updates, extract kanbans
    // commands.after("editor.update-file-content", console.log)

    registerActivity("board", {
      routes: ["/kanban", "/kanban/:board"],
      Component: lazy(() => import("./components/component")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })
  },
)
