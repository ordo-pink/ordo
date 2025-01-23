/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type SocketAddress } from "bun"

import { type TIntake } from "@ordo-pink/routary"

export const extract_request_ip = <$TIntake extends TIntake<{ request_ip: SocketAddress | null }>>(intake: $TIntake) => {
	intake.request_ip = intake.server.requestIP(intake.req)
}
