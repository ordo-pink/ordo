import { RoutaryOrdo } from "../../routary-ordo.types"

export const assign_request_id: RoutaryOrdo.AssignRequestId = intake => {
	intake.request_id = crypto.randomUUID()
}
