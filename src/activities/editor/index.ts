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
    },
    en: {
      "@ordo-activity-editor/title": "Editor",
      "@ordo-activity-editor/no-file": "Choose file",
    },
  },
}

export default EditorExtension
