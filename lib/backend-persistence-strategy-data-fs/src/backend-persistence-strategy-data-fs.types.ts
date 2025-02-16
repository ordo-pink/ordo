/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type TPersistenceStrategyDataFSParams = { root: string }

export type TPersistenceStategyDataFS = {
	Of: (root: string) => OrdoBackend.Data.PersistenceStrategy
}
