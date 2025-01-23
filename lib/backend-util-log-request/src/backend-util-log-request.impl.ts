/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { SocketAddress } from "bun"

import { type TIntake } from "@ordo-pink/routary"
import { type TLogger } from "@ordo-pink/logger"

// TODO Move to lib
export const log_request = <
	$TIntake extends TIntake<{ logger: TLogger; response_time?: string; status: number; request_ip: SocketAddress | null }>,
>({
	req,
	logger,
	response_time,
	status,
	request_ip,
}: $TIntake) => {
	const method = req.method

	const url_obj = new URL(req.url)
	const pathname =
		url_obj.pathname.endsWith("/") && url_obj.pathname.length > 1 ? url_obj.pathname.slice(0, -1) : url_obj.pathname

	const request_address = request_ip ? `${request_ip?.address}:${request_ip?.port}` : "localhost"
	const url = `${pathname}${url_obj.search}`

	logger.info(`${request_address} :: ${status} ${method} ${url} (${response_time}ms)`)
}
