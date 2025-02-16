/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TDefaultContext } from "@ordo-pink/backend-util-default-handler"
import type { TLogger } from "@ordo-pink/logger"

export type TDTChamber = {
	allow_origin: string[]
	data_persistence_strategy: OrdoBackend.Data.PersistenceStrategy
	logger: TLogger
	id_host: string
	dt_host: string
}

export type TDTContext = TDefaultContext & TDTChamber
