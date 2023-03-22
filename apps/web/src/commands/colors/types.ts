import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"

export type ColorCommandsState = {
  isShown: boolean
  target: Nullable<IOrdoDirectory<{ color: string }>>
}

export type ColorExtensionStore = {
  "ordo-command-colors": ColorCommandsState
}
