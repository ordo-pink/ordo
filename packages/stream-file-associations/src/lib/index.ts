import { FileAssociation, Command, PayloadCommand } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { map, merge, scan, shareReplay, Subject } from "rxjs"

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addFileAssociation$ = new Subject<FileAssociation>()
const removeFileAssociation$ = new Subject<FileAssociation>()
const clearFileAssociations$ = new Subject<null>()

const add = (newFileAssociation: FileAssociation) => (state: FileAssociation[]) =>
  [...state, newFileAssociation]

const remove = (FileAssociation: FileAssociation) => (state: FileAssociation[]) =>
  state.filter((a) => a.name === FileAssociation.name)

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

export const registerFileAssociation = (FileAssociation: FileAssociation) => {
  addFileAssociation$.next(FileAssociation)
}

export const unregisterFileAssociation = (FileAssociation: FileAssociation) => {
  removeFileAssociation$.next(FileAssociation)
}

export const clearFileAssociations = () => {
  clearFileAssociations$.next(null)
}
