import { CommandContext, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
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
      ru: { placeholder: "Можно начинать...", "open-file-in-editor": "Открыть в редакторе" },
      en: { placeholder: "Start typing...", "open-file-in-editor": "Open in Editor" },
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

    const OPEN_FILE_COMMAND = commands.on(
      "open-file-in-editor",
      ({ payload }: CommandContext<OrdoFilePath>) => {
        commands.emit("router.navigate", `/editor${payload}`)
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
