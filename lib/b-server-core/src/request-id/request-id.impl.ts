import type * as RequestId from "./request-id.types"

export const set: RequestId.Set = () => ({ request_id: crypto.randomUUID() })
