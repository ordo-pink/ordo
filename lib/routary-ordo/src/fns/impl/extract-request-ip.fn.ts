import { type RoutaryOrdo } from "../../routary-ordo.types"

export const extract_request_ip: RoutaryOrdo.ExtractRequestIP = intake => {
	intake.request_ip = intake.server.requestIP(intake.req)?.address ?? "No IP"
}
