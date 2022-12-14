import loadable from "@loadable/component"
import { BsLayoutSidebarInset } from "react-icons/bs"

import { OrdoActivityExtension } from "$core/types"

const EditorExtension: OrdoActivityExtension<"editor"> = {
  name: "ordo-activity-editor",
  Icon: BsLayoutSidebarInset,
  Component: loadable(() => import("$activities/editor/components")),
  paths: ["editor", "editor/:extension/:path"],
  readableName: "@ordo-activity-editor/title",
  translations: {
    ru: {
      "@ordo-activity-editor/title": "Редактор",
      "@ordo-activity-editor/no-file": "Выберите файл",
      "@ordo-activity-editor/unsupported-file":
        "Ordo не знает, как открыть этот файл. Поищем в расширениях?",
    },
    en: {
      "@ordo-activity-editor/title": "Editor",
      "@ordo-activity-editor/no-file": "Choose file",
      "@ordo-activity-editor/unsupported-file":
        "Ordo doesn't know how to open this file. Feel like finding an extension that can fix the problem?",
    },
  },
}

export default EditorExtension
