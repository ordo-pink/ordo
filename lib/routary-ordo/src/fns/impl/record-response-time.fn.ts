import { RoutaryOrdo } from "../../routary-ordo.types"
import { set_header } from "./set-header.fn"

export const start_response_timer: RoutaryOrdo.StartResponseTimer = intake => {
	const start_time = Date.now()

	intake.stop_response_timer = () => {
		const end_time = Date.now() - start_time
		intake.response_time = end_time
		const set_header_x_response_time = set_header("X-Response-Time", end_time.toString())

		return set_header_x_response_time(intake)
	}
}

export const stop_response_timer: RoutaryOrdo.StopResponseTimer = intake => intake.stop_response_timer?.()
