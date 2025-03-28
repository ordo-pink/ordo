/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { DefaultContext } from "@ordo-pink/backend-util-default-handler"
import type { Logger } from "@ordo-pink/logger"

export type TPBChamber = {
	id_host: string
	allow_origin: string[]
	data_persistence_strategy: OrdoBackend.Data.PersistenceStrategy
	logger: Logger
}

export type TPBContext = DefaultContext & TPBChamber
