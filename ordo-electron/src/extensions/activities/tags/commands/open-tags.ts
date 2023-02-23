import type { OrdoCommand } from "@core/types"

import { selectActivity } from "@client/activity-bar/store"

export const openTagsCommand: OrdoCommand<"tags"> = {
  title: "@tags/open-activity",
  icon: "BsTags",
  accelerator: "ctrl+t",
  showInCommandPalette: true,
  action: (_, { dispatch }) => {
    dispatch(selectActivity("ordo-activity-tags"))
  },
}
