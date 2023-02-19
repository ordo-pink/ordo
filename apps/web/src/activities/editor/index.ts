import { OpenEditorCommand } from "./commands/open-editor"
import { editorSlice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { EditorPersistedState } from "./types"
import { createActivityExtension } from "../../core/extensions/create-activity-extension"
import { OrdoExtensionProps } from "../../core/types"

const editor = createActivityExtension("editor", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-editor/title",
  routes: ["/editor"],
  commands: [OpenEditorCommand],
  storeSlice: editorSlice,
  translations: { ru, en },
  persistedState: {
    expandedDirectories: [],
    recentFiles: [],
  } as EditorPersistedState,
})

export type EditorProps = OrdoExtensionProps<typeof editor>

export default editor
