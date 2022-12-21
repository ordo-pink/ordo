import { editorSlice } from "$activities/editor/store"
import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("editor", {
  Component: () => import("$activities/editor/components"),
  Icon: () => import("$activities/editor/components/icon"),
  readableName: "@ordo-activity-editor/title",
  storeSlice: editorSlice,
  translations: {
    ru: {
      "@ordo-activity-editor/title": "Редактор",
      "@ordo-activity-editor/no-file": "Выберите файл",
      "@ordo-activity-editor/unsupported-file": "Ordo не знает, как открыть этот файл.",
      "@ordo-activity-editor/search-for-extensions": "Поищем в расширениях?",
    },
    en: {
      "@ordo-activity-editor/title": "Editor",
      "@ordo-activity-editor/no-file": "Choose file",
      "@ordo-activity-editor/unsupported-file": "Ordo doesn't know how to open this file.",
      "@ordo-activity-editor/search-for-extensions": "There might be an extension to fix that.",
    },
  },
})
