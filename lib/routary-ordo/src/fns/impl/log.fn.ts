import { RoutaryOrdo } from "../../routary-ordo.types"

export const log_request: RoutaryOrdo.LogRequest = ({
	logger,
	req,
	request_id,
	request_ip,
	request_language,
	response_time,
	status,
}) => {
	const method = req.method

	const url_obj = new URL(req.url)
	const pathname =
		url_obj.pathname.endsWith("/") && url_obj.pathname.length > 1 ? url_obj.pathname.slice(0, -1) : url_obj.pathname

	const url = `${pathname}${url_obj.search}`

	logger.info(`${request_id} ${status} ${method} ${request_language} ${url} (${response_time}ms) - ${request_ip}`)
}
