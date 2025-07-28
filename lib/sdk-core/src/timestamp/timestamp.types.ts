import type { GenericGuard as GenericGuard } from "../sdk-core.types"

export type Instance = number

export type Create = () => Instance
export type Guard = GenericGuard<Instance>

export type IsAfter = (inclusive_start: Instance, value: Instance) => boolean
export type IsBefore = (exclusive_end: Instance, value: Instance) => boolean
export type IsWithin = (inclusive_start: Instance, exclusive_end: Instance, value: Instance) => boolean
