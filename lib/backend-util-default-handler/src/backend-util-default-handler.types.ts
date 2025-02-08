/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { SocketAddress } from "bun"

import type { TLogger } from "@ordo-pink/logger"

export type TDefaultContext = {
	headers: Headers
	logger: TLogger
	payload?: unknown
	request_ip: SocketAddress | null
	status: number
	response_time?: string
	response_timer?: number
}
