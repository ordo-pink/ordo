import { createOrdoCommand } from "@ordo-pink/extensions"
import { IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import { createSearchParams } from "react-router-dom"

export const OpenInEditorCommand = createOrdoCommand<"ordo-activity-editor">({
  Icon: () => import("../components/open-in-editor-icon"),
  title: "@ordo-activity-editor/open-in-editor",
  showInCommandPalette: false,
  showInContextMenu: (x) => OrdoFile.isOrdoFile(x) && window.location.pathname !== "/editor",
  action: ({ navigate, contextMenuTarget }) =>
    navigate({
      pathname: "/editor",
      search: createSearchParams({ path: (contextMenuTarget as IOrdoFile).path }).toString(),
    }),
})
