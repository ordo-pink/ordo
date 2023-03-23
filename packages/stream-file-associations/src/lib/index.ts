import { FileAssociation, Command, PayloadCommand } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { map, merge, scan, shareReplay, Subject } from "rxjs"

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addFileAssociation$ = new Subject<FileAssociation>()
const removeFileAssociation$ = new Subject<string>()
const clearFileAssociations$ = new Subject<null>()

const add = (newFileAssociation: FileAssociation) => (state: FileAssociation[]) =>
  [...state, newFileAssociation]

const remove = (fileAssociation: string) => (state: FileAssociation[]) =>
  state.filter((a) => a.name === fileAssociation)

const clear = () => () => [] as FileAssociation[]

export const fileAssociations$ = merge(
  addFileAssociation$.pipe(map(add)),
  removeFileAssociation$.pipe(map(remove)),
  clearFileAssociations$.pipe(map(clear)),
).pipe(
  scan((acc, f) => f(acc), [] as FileAssociation[]),
  shareReplay(1),
)

export const _initFileAssociations = callOnce(() => {
  fileAssociations$.subscribe()

  return fileAssociations$
})

export const registerFileAssociation =
  (extensionName: string) => (name: string, fileAssociation: Omit<FileAssociation, "name">) => {
    addFileAssociation$.next({
      ...fileAssociation,
      name: `${extensionName}.${name}`,
    })
  }

export const unregisterFileAssociation = (extensionName: string) => (name: string) => {
  removeFileAssociation$.next(`${extensionName}.${name}`)
}
