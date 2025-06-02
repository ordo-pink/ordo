/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Server } from "@ordo-pink/sdk-server"

export namespace PersistenceStrategyDataFS {
	export type Params = { root: string }

	export type Create = (params: PersistenceStrategyDataFS.Params) => Server.Data.PersistenceStrategy
}
