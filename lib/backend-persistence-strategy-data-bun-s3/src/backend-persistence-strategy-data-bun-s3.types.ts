/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type TPersistenceStrategyDataS3Params = {
	access_key: string
	secret_key: string
	region: string
	bucket: string
	endpoint?: string
}

export type TPersistenceStrategyDataS3 = {
	Of: (params: TPersistenceStrategyDataS3Params) => OrdoBackend.Data.PersistenceStrategy
}
