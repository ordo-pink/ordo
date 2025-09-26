/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type * as Core from "./src/sdk-core.types"
export * as core from "./src/sdk-core.impl"

import * as core from "./src/sdk-core.impl"

declare global {
	var ordo: typeof core
}

globalThis.ordo = core
