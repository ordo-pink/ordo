/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger } from "@ordo-pink/logger"
import type { RoutaryOrdo } from "@ordo-pink/routary-ordo"

export type TDTFuel = {
	allow_origin: string[]
	data_persistence_strategy: OrdoBackend.Data.PersistenceStrategy
	logger: Logger
	id_host: string
	dt_host: string
}

export type TDTContext = RoutaryOrdo.Fuel & TDTFuel
