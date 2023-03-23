import { CommandContext, OrdoFilePath } from "@ordo-pink/common-types"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"

import "./editor.css"

const EditorActivity = {
  routes: ["/editor", "/editor/:filePath*"],
  Component: lazy(() => import("./components/editor-component")),
  Icon: lazy(() => import("./components/editor-icon")),
  Sidebar: lazy(() => import("./components/sidebar")),
  name: "editor.editor",
}

export default createExtension("editor", ({ registerActivity, commands, logger }) => {
  logger.debug('Initialising "editor" extension')

  commands.on("editor.open-file", ({ payload, logger }: CommandContext<OrdoFilePath>) => {
    logger.debug('"editor.open-file" invoked:', payload)
    commands.emit("router.navigate", `/editor${payload}`)
  })

  registerActivity(EditorActivity)

  logger.debug('"editor" initialisation complete')
})
