import { createActivityExtension } from "@ordo-pink/extensions"
import { IgnoreSave } from "./commands/ignore-save"
import { OpenEditorCommand } from "./commands/open-editor"
import { OpenInEditorCommand } from "./commands/open-in-editor"
import { editorSlice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { EditorPersistedState } from "./types"

const editor = createActivityExtension("editor", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-editor/title",
  routes: ["/editor"],
  commands: [OpenEditorCommand, OpenInEditorCommand, IgnoreSave],
  storeSlice: editorSlice,
  translations: { ru, en },
  persistedState: {
    recentFiles: [],
  } as EditorPersistedState,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EditorProps = any

export default editor
