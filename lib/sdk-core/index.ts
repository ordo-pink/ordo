/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as CORE from "./src/sdk-core.constants"
import * as core from "./src/sdk-core.impl"

if (!globalThis.ordo) globalThis.ordo = core
if (!globalThis.ORDO) globalThis.ORDO = CORE

export * as CORE from "./src/sdk-core.constants"
export type * as Core from "./src/sdk-core.types"
export * as core from "./src/sdk-core.impl"

declare global {
	var ordo: typeof core
	var ORDO: typeof CORE
}
