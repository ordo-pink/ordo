import type { OrdoActivityExtension } from "@core/types"
import { openCheckboxesCommand } from "./commands/open-checkboxes"

import Checkboxes from "./workspace"

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
