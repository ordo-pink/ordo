import type { OrdoActivityExtension } from "@core/types"

import { openCheckboxesCommand } from "@extensions/activities/checkboxes/commands/open-checkboxes"

import Checkboxes from "@extensions/activities/checkboxes/workspace"

const TagsActivityExtension: OrdoActivityExtension<"checkboxes"> = {
  icon: "BsCheck2Square",
  name: "ordo-activity-checkboxes",
  commands: [openCheckboxesCommand],
  translations: {
    ru: {
      checkboxes: "Дела",
      "@checkboxes/open-activity": "Открыть Дела",
    },
    en: {
      checkboxes: "Checkboxes",
      "@checkboxes/open-activity": "Open Checkboxes",
    },
  },
  sidebarComponent: null,
  workspaceComponent: Checkboxes,
}

export default TagsActivityExtension
