import { createOrdoCommand } from "@ordo-pink/extensions"
import { IOrdoDirectory, OrdoDirectory } from "@ordo-pink/fs-entity"
import { showModal } from "../store"

export const ChangeDirectoryColorCommand = createOrdoCommand<"ordo-command-colors">({
  Icon: () => import("../components/change-directory-color-icon"),
  title: "@ordo-command-colors/change-directory-color",
  showInCommandPalette: false,
  showInContextMenu: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
  action: ({ state, dispatch, contextMenuTarget }) => {
    if (!contextMenuTarget || !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(showModal(contextMenuTarget as IOrdoDirectory<{ color: string }>))
  },
})
