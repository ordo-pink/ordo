import { GenericGuard as GenericGuard } from "../sdk-core.types"

export type Instance = `${string}-${string}-${string}-${string}-${string}`

export type Guard = GenericGuard<Instance>

export type Create = () => Instance
