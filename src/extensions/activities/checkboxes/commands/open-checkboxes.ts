import type { OrdoCommand } from "@core/types"

import { selectActivity } from "@client/activity-bar/store"

export const openCheckboxesCommand: OrdoCommand<"checkboxes"> = {
  title: "@checkboxes/open-activity",
  icon: "BsCheck2Square",
  accelerator: "alt+c",
  showInCommandPalette: true,
  action: (_, { dispatch }) => {
    dispatch(selectActivity("ordo-activity-checkboxes"))
  },
}
