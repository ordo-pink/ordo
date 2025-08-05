import type * as T from "./log.types"

export const request: T.Request = ({ env, mut, request, response }) => {
	const method = request.method
	const status = response.status
	const { request_id, request_ip, request_language, response_time } = mut

	const url_obj = new URL(request.url)
	const pathname =
		url_obj.pathname.endsWith("/") && url_obj.pathname.length > 1 ? url_obj.pathname.slice(0, -1) : url_obj.pathname

	const url = `${pathname}${url_obj.search}`

	env.logger.info(`${request_id} ${status} ${method} ${request_language} ${url} (${response_time}ms) - ${request_ip}`)

	return {}
}
