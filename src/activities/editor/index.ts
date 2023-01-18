import { editorSlice } from "$activities/editor/store"

import { createActivityExtension } from "$core/extensions/create-activity-extension"
import { router } from "$core/router"

export default createActivityExtension("editor", {
  Component: () => import("$activities/editor/components"),
  Icon: () => import("$activities/editor/components/icon"),
  readableName: "@ordo-activity-editor/title",
  // TODO: Remove / at the beginning if it is present
  commands: [
    {
      Icon: () => import("$activities/editor/components/icon"),
      title: "@ordo-activity-editor/open-editor",
      accelerator: "ctrl+shift+e",
      showInCommandPalette: true,
      showInContextMenu: false,
      action: () => router.navigate("/editor"),
    },
  ],
  storeSlice: editorSlice,
  translations: {
    ru: {
      "@ordo-activity-editor/title": "Редактор",
      "@ordo-activity-editor/open-editor": "Открыть редактор",
      "@ordo-activity-editor/no-file": "Выберите файл",
      "@ordo-activity-editor/unsupported-file": "Ordo не знает, как открыть этот файл.",
      "@ordo-activity-editor/search-for-extensions": "Поищем в расширениях?",
      "@ordo-activity-editor/remove": "Удалить",
      "@ordo-activity-editor/create-file": "Создать файл",
      "@ordo-activity-editor/create-directory": "Создать папку",
      "@ordo-activity-editor/create-modal.create-file.placeholder": "Название файла",
      "@ordo-activity-editor/create-modal.create-directory.placeholder": "Название папки",
    },
    en: {
      "@ordo-activity-editor/title": "Editor",
      "@ordo-activity-editor/open-editor": "Open Editor",
      "@ordo-activity-editor/no-file": "Choose file",
      "@ordo-activity-editor/unsupported-file": "Ordo doesn't know how to open this file.",
      "@ordo-activity-editor/search-for-extensions": "There might be an extension to fix that.",
      "@ordo-activity-editor/remove": "Remove",
      "@ordo-activity-editor/create-file": "Create file",
      "@ordo-activity-editor/create-directory": "Create directory",
      "@ordo-activity-editor/create-modal.create-file.placeholder": "File name",
      "@ordo-activity-editor/create-modal.create-directory.placeholder": "Directory name",
    },
  },
})
