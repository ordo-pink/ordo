/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export * from "./src/core.types"
export * from "./src/user.impl"
export * from "./src/user.types"

import { user } from "./src/user.impl"

export const core = {
	user,
}
