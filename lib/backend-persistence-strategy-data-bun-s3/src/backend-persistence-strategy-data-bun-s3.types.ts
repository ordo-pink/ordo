/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Server } from "@ordo-pink/sdk-server"

export namespace PersistenceStrategyDataBunS3 {
	export type Params = { access_key: string; secret_key: string; region: string; bucket: string; endpoint?: string }

	export type Create = (params: PersistenceStrategyDataBunS3.Params) => Server.Data.PersistenceStrategy
}
