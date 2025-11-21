/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type GlobalState = {
	hunter: OrdoClient.Command.Hunter
}

export type Args = {
	hosts: Ordo.Hosts
	fetch: OrdoClient.Fetch
	data_repository: OrdoClient.Data.Repository
	content_repository: Ordo.Content.Repository
}
