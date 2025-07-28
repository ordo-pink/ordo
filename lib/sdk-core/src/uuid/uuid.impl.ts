import * as UUID from "./uuid.constants"
import type * as Uuid from "./uuid.types"

export const create: Uuid.Create = () => crypto.randomUUID()
export const guard: Uuid.Guard = (x): x is Uuid.Instance => typeof x === "string" && UUID.RX.test(x)
