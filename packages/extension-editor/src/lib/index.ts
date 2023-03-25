import { CommandContext, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension, currentActivity$ } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs"

import "./editor.css"

export default createExtension(
  "editor",
  ({
    commands,
    registerActivity,
    registerTranslations,
    registerFileAssociation,
    registerContextMenuItem,
  }) => {
    registerTranslations({
      ru: {
        placeholder: "Можно начинать...",
        "open-file-in-editor": "Открыть в редакторе",
        "search-file-placeholder": "Find file...",
      },
      en: {
        placeholder: "Start typing...",
        "open-file-in-editor": "Open in Editor",
        "search-file-placeholder": "Найти файл...",
      },
    })

    commands.after(
      "fs.create-file",
      ({ payload }: CommandContext<{ file: IOrdoFile; content?: string }>) => {
        const currentActivity = currentActivity$.value

        if (currentActivity?.name === "editor.editor") {
          commands.emit("editor.open-file-in-editor", payload.file.path)
        }
      },
    )

    commands.on("collapse-directory", ({ payload }) => {
      const driver = fsDriver$.getValue()
      const drive = drive$.getValue()

      if (!driver || !drive || payload.metadata.isExpanded === false) return

      commands.emit("fs.update-directory", {
        ...payload,
        metadata: {
          ...payload.metadata,
          isExpanded: false,
        },
      })
    })

    commands.on("expand-directory", ({ payload }) => {
      const driver = fsDriver$.getValue()
      const drive = drive$.getValue()

      if (!driver || !drive || payload.metadata.isExpanded === true) return

      commands.emit("fs.update-directory", {
        ...payload,
        metadata: {
          ...payload.metadata,
          isExpanded: true,
        },
      })
    })

    const OPEN_FILE_COMMAND = commands.on(
      "open-file-in-editor",
      ({ payload }: CommandContext<OrdoFilePath>) => {
        commands.emit("router.navigate", `/editor${payload}`)

        const drive = drive$.getValue()

        if (!drive) return

        let directory = OrdoFile.findParent(payload, drive.root)

        while (directory && directory.path !== "/") {
          commands.emit("editor.expand-directory", directory)

          directory = OrdoDirectory.findParent(directory.path, drive.root)
        }
      },
    )

    registerContextMenuItem(OPEN_FILE_COMMAND, {
      Icon: BsReverseLayoutTextSidebarReverse,
      payloadCreator: (target) => target.path,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    registerActivity("editor", {
      routes: ["/editor", "/editor/:filePath*"],
      Component: lazy(() => import("./components/editor-component")),
      Icon: lazy(() => import("./components/editor-icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })

    registerFileAssociation("md", {
      Component: lazy(() => import("./components/md")),
      Icon: lazy(() => import("./components/md/icon")),
      fileExtensions: [".md"],
    })
  },
)
