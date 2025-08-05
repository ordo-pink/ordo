import type * as T from "./request-ip.types"

export const set: T.Set = ({ request, server }) => ({ request_ip: server.requestIP(request)?.address ?? "No IP" })
