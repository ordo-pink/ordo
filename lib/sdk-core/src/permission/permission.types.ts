import type * as PERMISSION from "./permission.constants"
import type { GenericGuard } from "../sdk-core.types"

export type Instance = PERMISSION.VALUE
export type Action = PERMISSION.ACTION

export type Full = () => Instance
export type Empty = () => Instance

export type Guard = GenericGuard<Instance>

export type CheckPermission = (action: PERMISSION.ACTION, permission: Instance) => boolean
