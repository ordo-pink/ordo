import { CommandContext, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs"

import "./editor.css"

export default createExtension(
  "editor",
  ({
    registerActivity,
    registerFileAssociation,
    commands,
    logger,
    registerTranslations,
    registerContextMenuItem,
  }) => {
    logger.debug('Initialising "editor" extension')

    registerTranslations({
      ru: { placeholder: "Можно начинать...", "open-file-in-editor": "Открыть в редакторе" },
      en: { placeholder: "Start typing...", "open-file-in-editor": "Open in Editor" },
    })

    const OPEN_FILE_COMMAND = commands.on(
      "open-file-in-editor",
      ({ payload, logger }: CommandContext<OrdoFilePath>) => {
        logger.debug('"open-file-in-editor" invoked:', payload)
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

    logger.debug('"editor" initialisation complete')
  },
)
