/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RoutaryOrdo } from "../../routary-ordo.types"

export const assign_request_id: RoutaryOrdo.AssignRequestId = intake => {
	intake.request_id = crypto.randomUUID()
}
