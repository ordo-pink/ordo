import { CommandContext, FileAssociation, OrdoFilePath } from "@ordo-pink/common-types"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { Subject } from "rxjs"

import "./editor.css"

export const currentFileAssociation$ = new Subject<FileAssociation>()

export default createExtension(
  "editor",
  ({ registerActivity, registerFileAssociation, commands, logger, registerTranslations }) => {
    logger.debug('Initialising "editor" extension')

    registerTranslations({
      ru: { placeholder: "Можно начинать..." },
      en: { placeholder: "Start typing..." },
    })

    commands.on("editor.open-file", ({ payload, logger }: CommandContext<OrdoFilePath>) => {
      logger.debug('"editor.open-file" invoked:', payload)
      commands.emit("router.navigate", `/editor${payload}`)
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

    logger.debug('"editor" initialisation complete')
  },
)
