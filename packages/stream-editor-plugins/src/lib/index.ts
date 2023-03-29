import { EditorPlugin, Command, PayloadCommand } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { map, merge, scan, shareReplay, Subject } from "rxjs"

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addEditorPlugin$ = new Subject<EditorPlugin>()
const removeEditorPlugin$ = new Subject<string>()
const clearEditorPlugins$ = new Subject<null>()

const add = (newEditorPlugin: EditorPlugin) => (state: EditorPlugin[]) =>
  [...state, newEditorPlugin]

const remove = (activity: string) => (state: EditorPlugin[]) =>
  state.filter((a) => a.name === activity)

const clear = () => () => [] as EditorPlugin[]

export const editorPlugins$ = merge(
  addEditorPlugin$.pipe(map(add)),
  removeEditorPlugin$.pipe(map(remove)),
  clearEditorPlugins$.pipe(map(clear)),
).pipe(
  scan((acc, f) => f(acc), [] as EditorPlugin[]),
  shareReplay(1),
)

export const _initEditorPlugins = callOnce(() => {
  editorPlugins$.subscribe()

  return editorPlugins$
})

export const registerEditorPlugin =
  (extensionName: string) => (name: string, activity: Omit<EditorPlugin, "name">) => {
    addEditorPlugin$.next({
      ...activity,
      name: `${extensionName}.${name}`,
    })
  }

export const unregisterEditorPlugin = (extensionName: string) => (name: string) => {
  removeEditorPlugin$.next(`${extensionName}.${name}`)
}

export const clearEditorPlugins = () => {
  clearEditorPlugins$.next(null)
}
