import OpenEditorCommand from "$activities/editor/commands/open-editor"
import { editorSlice } from "$activities/editor/store"
import en from "$activities/editor/translations/en.json"
import ru from "$activities/editor/translations/ru.json"

import { EditorMetadata } from "$activities/editor/types"
import { createActivityExtension } from "$core/extensions/create-activity-extension"
import { createExtensionMetadata } from "$core/extensions/create-extension-metadata"

export default createActivityExtension("editor", {
  Component: () => import("$activities/editor/components"),
  Icon: () => import("$activities/editor/components/icon"),
  readableName: "@ordo-activity-editor/title",
  routes: ["/editor"],
  commands: [OpenEditorCommand],
  storeSlice: editorSlice,
  translations: { ru, en },
  metadata: createExtensionMetadata<EditorMetadata>({
    expandedDirectories: [],
    recentFiles: [],
  }),
})
