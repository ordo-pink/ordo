/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type * as OrdoClientMaoka from "./src/sdk-client-maoka.types"
export * as ordo_client_maoka from "./src/sdk-client-maoka.impl"

import * as client_maoka from "./src/sdk-client-maoka.impl"

declare global {
	var ordo_client_maoka: typeof client_maoka
}

if (!globalThis.ordo_client_maoka) globalThis.ordo_client_maoka = client_maoka
