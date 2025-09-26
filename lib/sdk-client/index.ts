/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as client from "./src/sdk-client.impl"

export type * as OrdoClient from "./src/sdk-client.types"
export * as ordo_client from "./src/sdk-client.impl"

declare global {
	var ordo_client: typeof client
}

globalThis.ordo_client = client
