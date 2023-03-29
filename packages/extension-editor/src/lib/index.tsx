import { CommandContext, IOrdoDirectory, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FileIcon } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension, currentActivity$ } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { BsFolder2, BsFolder2Open, BsReverseLayoutTextSidebarReverse } from "react-icons/bs"

import "./editor.css"

export default createExtension(
  "editor",
  ({
    commands,
    registerActivity,
    registerTranslations,
    registerEditorPlugin,
    registerFileAssociation,
    registerContextMenuItem,
    registerCommandPaletteItem,
    translate,
  }) => {
    registerTranslations({
      ru: {
        placeholder: "Можно начинать...",
        "open-file-in-editor": "Открыть в редакторе",
        "search-file-placeholder": "Найти файл...",
        "open-editor": "Открыть редактор",
        "expand-directories": "Развернуть",
        "collapse-directories": "Свернуть",
        "open-in-editor": "Открыть в редакторе...",
        "used-space": "Использовано",
      },
      en: {
        placeholder: "Start typing...",
        "open-file-in-editor": "Open in Editor",
        "search-file-placeholder": "Find file...",
        "open-editor": "Open Editor",
        "expand-directories": "Expand",
        "collapse-directories": "Collapse",
        "open-in-editor": "Open file in Editor...",
        "used-space": "Used space",
      },
    })

    registerEditorPlugin("highlight-code", {
      Plugin: lazy(() => import("./components/plugins/highlight-code-plugin")),
    })

    registerCommandPaletteItem({
      id: "open-in-editor",
      name: translate("open-in-editor"),
      Icon: BsReverseLayoutTextSidebarReverse,
      onSelect: () => {
        const drive = drive$.getValue()

        hideCommandPalette()

        if (!drive) return

        showCommandPalette(
          drive.root.getFilesDeep().map((file) => ({
            id: file.path,
            name: file.readableName,
            Icon: () => <FileIcon file={file} />,
            onSelect: () => {
              commands.emit("editor.open-file-in-editor", file.path)

              hideCommandPalette()
            },
          })),
        )
      },
    })

    registerCommandPaletteItem({
      id: "open-editor",
      name: translate("open-editor"),
      Icon: BsReverseLayoutTextSidebarReverse,
      onSelect: () => {
        commands.emit("router.navigate", "/editor")

        hideCommandPalette()
      },
    })

    registerCommandPaletteItem({
      id: "collapse-directories",
      name: translate("collapse-directories"),
      Icon: BsFolder2,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("editor.collapse-directories", drive.root)

        hideCommandPalette()
      },
    })

    registerCommandPaletteItem({
      id: "expand-directories",
      name: translate("expand-directories"),
      Icon: BsFolder2Open,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("editor.expand-directories", drive.root)

        hideCommandPalette()
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

    const EXPAND_DIRECTORIES_COMMAND = commands.on(
      "expand-directories",
      ({ payload }: CommandContext<IOrdoDirectory>) => {
        const drive = drive$.getValue()

        if (!drive) return

        const directories = payload.children.filter((child) =>
          OrdoDirectory.isOrdoDirectory(child),
        ) as IOrdoDirectory<{ isExpanded: boolean }>[]
        directories.push(payload as IOrdoDirectory<{ isExpanded: boolean }>)

        directories.forEach((directory) => {
          if (directory.metadata.isExpanded) return

          commands.emit("editor.expand-directory", directory)
        })
      },
    )

    registerContextMenuItem(EXPAND_DIRECTORIES_COMMAND, {
      Icon: BsFolder2Open,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    const COLLAPSE_DIRECTORIES_COMMAND = commands.on(
      "collapse-directories",
      ({ payload }: CommandContext<IOrdoDirectory>) => {
        const drive = drive$.getValue()

        if (!drive) return

        const directories = payload.children.filter((child) =>
          OrdoDirectory.isOrdoDirectory(child),
        ) as IOrdoDirectory<{ isExpanded: boolean }>[]
        directories.push(payload as IOrdoDirectory<{ isExpanded: boolean }>)

        directories.forEach((directory) => {
          if (!directory.metadata.isExpanded) return

          commands.emit("editor.collapse-directory", directory)
        })
      },
    )

    registerContextMenuItem(COLLAPSE_DIRECTORIES_COMMAND, {
      Icon: BsFolder2,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    commands.on("collapse-directory", ({ payload }) => {
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

    registerFileAssociation("pdf", {
      Component: lazy(() => import("./components/pdf")),
      Icon: lazy(() => import("./components/pdf/icon")),
      fileExtensions: [".pdf"],
    })

    registerFileAssociation("media", {
      Component: lazy(() => import("./components/media")),
      Icon: lazy(() => import("./components/media/icon")),
      fileExtensions: [".wav", ".mp3", ".ogg", ".mp4", ".adts", ".webm", ".caf", ".flac"],
    })

    registerFileAssociation("img", {
      Component: lazy(() => import("./components/img")),
      Icon: lazy(() => import("./components/img/icon")),
      fileExtensions: [
        ".apng",
        ".avif",
        ".gif",
        ".jpg",
        ".jpeg",
        ".pjpeg",
        ".pjp",
        ".svg",
        ".webp",
        ".bmp",
        ".ico",
        ".cur",
        ".tif",
        ".jfif",
        ".tiff",
        ".png",
      ],
    })
  },
)
