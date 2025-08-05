/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger } from "@ordo-pink/sdk-core"
import type { Routary } from "@ordo-pink/oss-routary"
import type { RoutaryOrdo } from "@ordo-pink/b-server-core"
import type { Server } from "@ordo-pink/sdk-server"

export namespace ServerPB {
	export type Params = {
		id_host: string
		allow_origin: string[]
		data_persistence_strategy: Server.Data.PersistenceStrategy
		logger: Logger
	}

	export type Fuel = RoutaryOrdo.Fuel & ServerPB.Params

	export type Intake = Routary.Intake<ServerPB.Fuel>
}
