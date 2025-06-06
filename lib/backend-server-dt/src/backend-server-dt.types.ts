/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger } from "@ordo-pink/sdk-core"
import type { Routary } from "@ordo-pink/routary"
import type { RoutaryOrdo } from "@ordo-pink/routary-ordo"
import type { Server } from "@ordo-pink/sdk-server"

export namespace ServerDT {
	export type Params = {
		allow_origin: string[]
		data_persistence_strategy: Server.Data.PersistenceStrategy
		logger: Logger
		id_host: string
		dt_host: string
	}

	export type Fuel = RoutaryOrdo.Fuel & ServerDT.Params

	export type Intake = Routary.Intake<ServerDT.Fuel>
}
