import type { Core } from "@ordo-pink/sdk-core"

export type Mut = { request_id: Core.Uuid.Instance }
export type Set = () => Mut
