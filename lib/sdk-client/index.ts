/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as CLIENT from "./src/sdk-client.constants"
import * as client from "./src/sdk-client.impl"

export type * as Client from "./src/sdk-client.types"
export * as CLIENT from "./src/sdk-client.constants"
export * as client from "./src/sdk-client.impl"

declare global {
	var ordo_client: typeof client
	var ORDO_CLIENT: typeof CLIENT
}

if (!globalThis.ORDO_CLIENT) globalThis.ORDO_CLIENT = CLIENT
if (!globalThis.ordo_client) globalThis.ordo_client = client
