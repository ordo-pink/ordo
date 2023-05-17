import { $createListNode } from "@lexical/list"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { CommandContext, OrdoDirectoryDTO, IconSize, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FileIcon } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension, currentActivity$ } from "@ordo-pink/stream-extensions"
import { $createParagraphNode, $getNearestNodeFromDOMNode, LexicalEditor } from "lexical"
import { lazy } from "react"
import {
  BsBlockquoteLeft,
  BsFolder2,
  BsFolder2Open,
  BsListCheck,
  BsListOl,
  BsListUl,
  BsReverseLayoutTextSidebarReverse,
  BsTextParagraph,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
} from "react-icons/bs"

import "./editor.css"

export default createExtension(
  "editor",
  ({
    commands,
    translate,
    registerActivity,
    registerTranslations,
    registerEditorPlugin,
    registerFileAssociation,
    registerContextMenuItem,
    registerCommandPaletteItem,
  }) => {
    registerTranslations({
      ru: {
        editor: "Редактор",
        placeholder: "Можно начинать...",
        "open-file-in-editor": "Открыть в редакторе",
        "search-file-placeholder": "Найти файл...",
        "open-editor": "Открыть редактор",
        "expand-directories": "Развернуть",
        "collapse-directories": "Свернуть",
        "open-in-editor": "Открыть в редакторе...",
        "used-space": "Использовано",
        "turn-to-heading-1": "Заголовок 1",
        "turn-to-heading-2": "Заголовок 2",
        "turn-to-heading-3": "Заголовок 3",
        "turn-to-paragraph": "Текст",
        "turn-to-blockquote": "Цитата",
        "turn-to-checklist": "Список с птичками",
        "turn-to-ordered-list": "Упорядоченный список",
        "turn-to-unordered-list": "Неупорядоченный список",
      },
      en: {
        editor: "Editor",
        placeholder: "Start typing...",
        "open-file-in-editor": "Open in Editor",
        "search-file-placeholder": "Find file...",
        "open-editor": "Open Editor",
        "expand-directories": "Expand",
        "collapse-directories": "Collapse",
        "open-in-editor": "Open file in Editor...",
        "used-space": "Used space",
        "turn-to-heading-1": "Heading 1",
        "turn-to-heading-2": "Heading 2",
        "turn-to-heading-3": "Heading 3",
        "turn-to-paragraph": "Text",
        "turn-to-blockquote": "Blockquote",
        "turn-to-checklist": "Checkable List",
        "turn-to-ordered-list": "Ordered List",
        "turn-to-unordered-list": "Unordered List",
      },
    })

    // Line transformers ------------------------------------------------------

    // H1 ---------------------------------------------------------------------

    const TURN_TO_HEADING_1 = commands.on(
      "turn-to-heading-1",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createHeadingNode("h1"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_HEADING_1, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsTypeH1,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // H2 ---------------------------------------------------------------------

    const TURN_TO_HEADING_2 = commands.on(
      "turn-to-heading-2",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createHeadingNode("h2"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_HEADING_2, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsTypeH2,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // H3 ---------------------------------------------------------------------

    const TURN_TO_HEADING_3 = commands.on(
      "turn-to-heading-3",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createHeadingNode("h3"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_HEADING_3, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsTypeH3,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // Paragraph --------------------------------------------------------------

    const TURN_TO_PARAGRAPH = commands.on(
      "turn-to-paragraph",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createParagraphNode(), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_PARAGRAPH, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsTextParagraph,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // Blockquote -------------------------------------------------------------

    const TURN_TO_BLOCKQUOTE = commands.on(
      "turn-to-blockquote",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createQuoteNode(), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_BLOCKQUOTE, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsBlockquoteLeft,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // Checklist --------------------------------------------------------------

    const TURN_TO_CHECKABLE_LIST = commands.on(
      "turn-to-checklist",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createListNode("check"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_CHECKABLE_LIST, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsListCheck,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // Ordered list -----------------------------------------------------------

    const TURN_TO_ORDERED_LIST = commands.on(
      "turn-to-ordered-list",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createListNode("number"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_ORDERED_LIST, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsListOl,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
    })

    // Unordered list ---------------------------------------------------------

    const TURN_TO_UNORDERED_LIST = commands.on(
      "turn-to-unordered-list",
      ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
        payload.editor.update(() => {
          const node = $getNearestNodeFromDOMNode(payload.element)

          node && node.replace($createListNode("bullet"), true)
        })
      },
    )

    registerContextMenuItem(TURN_TO_UNORDERED_LIST, {
      payloadCreator: (payload) => payload,
      type: "update",
      Icon: BsListUl,
      shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
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

        if (!drive) return

        showCommandPalette(
          OrdoDirectory.getFilesDeep(drive.root).map((file) => ({
            id: file.path,
            name: file.readableName,
            Icon: () => (
              <FileIcon
                size={IconSize.SMALL}
                file={file}
              />
            ),
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
      },
    })

    // commands.after("fs.create-file.complete", ({ payload }: CommandContext<IOrdoFile>) => {
    //   const currentActivity = wieldCurrentActivity()

    //   if (currentActivity?.name === "editor.editor") {
    //     commands.emit("editor.open-file-in-editor", payload.path)
    //   }
    // })

    const EXPAND_DIRECTORIES_COMMAND = commands.on(
      "expand-directories",
      ({ payload }: CommandContext<OrdoDirectoryDTO>) => {
        const drive = drive$.getValue()

        if (!drive) return

        const directories = payload.children.filter((child) =>
          OrdoDirectory.isOrdoDirectory(child),
        ) as OrdoDirectoryDTO<{ isExpanded: boolean }>[]
        directories.push(payload as OrdoDirectoryDTO<{ isExpanded: boolean }>)

        directories.forEach((directory) => {
          if (directory.metadata.isExpanded) return

          commands.emit("editor.expand-directory", directory)
        })
      },
    )

    registerContextMenuItem(EXPAND_DIRECTORIES_COMMAND, {
      type: "update",
      Icon: BsFolder2Open,
      payloadCreator: (target) => target,
      shouldShow: (target) => {
        const currentActivity = currentActivity$.getValue()

        return (
          !!currentActivity &&
          currentActivity.name === "editor.editor" &&
          OrdoDirectory.isOrdoDirectory(target)
        )
      },
    })

    const COLLAPSE_DIRECTORIES_COMMAND = commands.on(
      "collapse-directories",
      ({ payload }: CommandContext<OrdoDirectoryDTO>) => {
        const drive = drive$.getValue()

        if (!drive) return

        const directories = payload.children.filter((child) =>
          OrdoDirectory.isOrdoDirectory(child),
        ) as OrdoDirectoryDTO<{ isExpanded: boolean }>[]
        directories.push(payload as OrdoDirectoryDTO<{ isExpanded: boolean }>)

        directories.forEach((directory) => {
          if (!directory.metadata.isExpanded) return

          commands.emit("editor.collapse-directory", directory)
        })
      },
    )

    registerContextMenuItem(COLLAPSE_DIRECTORIES_COMMAND, {
      type: "update",
      Icon: BsFolder2,
      payloadCreator: (target) => target,
      shouldShow: (target) => {
        const currentActivity = currentActivity$.getValue()

        return (
          !!currentActivity &&
          currentActivity.name === "editor.editor" &&
          OrdoDirectory.isOrdoDirectory(target)
        )
      },
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
      type: "read",
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
      Component: lazy(() => import("./associations/md")),
      Icon: lazy(() => import("./associations/md/icon")),
      fileExtensions: [".md"],
    })

    registerFileAssociation("pdf", {
      Component: lazy(() => import("./associations/pdf")),
      Icon: lazy(() => import("./associations/pdf/icon")),
      fileExtensions: [".pdf"],
    })

    registerFileAssociation("media", {
      Component: lazy(() => import("./associations/media")),
      Icon: lazy(() => import("./associations/media/icon")),
      fileExtensions: [".wav", ".mp3", ".ogg", ".mp4", ".adts", ".webm", ".caf", ".flac"],
    })

    registerFileAssociation("img", {
      Component: lazy(() => import("./associations/img")),
      Icon: lazy(() => import("./associations/img/icon")),
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
