import { CommandContext, FileAssociation, OrdoFilePath } from "@ordo-pink/common-types"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { Subject } from "rxjs"

import "./editor.css"

export const currentFileAssociation$ = new Subject<FileAssociation>()

const MdFileAssociation: FileAssociation = {
  name: "editor.md",
  Component: lazy(() => import("./components/md")),
  Icon: lazy(() => import("./components/md/icon")),
  fileExtensions: [".md"],
}

const EditorActivity = {
  routes: ["/editor", "/editor/:filePath*"],
  Component: lazy(() => import("./components/editor-component")),
  Icon: lazy(() => import("./components/editor-icon")),
  Sidebar: lazy(() => import("./components/sidebar")),
  name: "editor.editor",
}

export default createExtension(
  "editor",
  ({ registerActivity, registerFileAssociation, commands, logger }) => {
    logger.debug('Initialising "editor" extension')

    commands.on("editor.open-file", ({ payload, logger }: CommandContext<OrdoFilePath>) => {
      logger.debug('"editor.open-file" invoked:', payload)
      commands.emit("router.navigate", `/editor${payload}`)
    })

    registerActivity(EditorActivity)

    registerFileAssociation(MdFileAssociation)

    logger.debug('"editor" initialisation complete')
  },
)
