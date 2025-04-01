/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type RoutaryOrdo } from "../../routary-ordo.types"

export const extract_request_ip: RoutaryOrdo.ExtractRequestIP = intake => {
	intake.request_ip = intake.server.requestIP(intake.req)?.address ?? "No IP"
}
