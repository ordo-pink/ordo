/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { MetadataLink } from "@ordo-pink/maoka-components"

const StyledMain = MaokaStyled.Tags.main("h-full flex items-center justify-center")

export default StyledMain(() => {
	return () => StyledCardWrapper(() => () => [RecentFilesCard, UserStatsCard, UserSessionsCard])
})

const StyledCardWrapper = MaokaStyled.Tags.div(
	"p-2 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
)

const StyledCard = MaokaStyled.Tags.div(
	"w-full flex flex-col gap-2 h-full bg-neutral-100 dark:bg-neutral-900 rounded-md p-4 shadow-lg",
)
const StyledCardHeader = MaokaStyled.Tags.h2("text-xl font-bold")
const StyledCardBody = MaokaStyled.Tags.div()

const StyledUserStat = MaokaStyled.Tags.div("")

const RecentFilesCard = StyledCard(({ use }) => {
	const get_metadata = use(MaokaOrdo.Jabs.Metadata.get$())

	return () => {
		const metadata = get_metadata()

		return [
			StyledCardHeader(() => () => "Recently Updated Files"),
			StyledCardBody(
				() => () =>
					metadata
						.sort((a, b) => {
							const last_update_a = a.get_updated_at()
							const last_update_b = b.get_updated_at()

							return last_update_a < last_update_b ? 1 : last_update_a > last_update_b ? -1 : 0
						})
						.slice(0, 5)
						.map(metadata => MetadataLink({ metadata, children: metadata.get_name() })),
			),
		]
	}
})

const StyledUserName = MaokaStyled.Tags.div(
	"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent text-nowrap",
)

const UserStatsCard = StyledCard(({ use }) => {
	const get_count = use(MaokaOrdo.Jabs.Metadata.count$)
	const get_user = use(MaokaOrdo.Jabs.User.get_current$)

	return () => {
		const user = get_user()
		const count = get_count()

		if (!user) return

		return [
			StyledCardHeader(() => () => StyledUserName(() => () => user.get_readable_name())),
			StyledCardBody(() => () => [
				// TODO Progress bar
				StyledUserStat(() => () => `Max file size: ${user.get_max_upload_size()}MB`),
				StyledUserStat(() => () => `Used space: ${count} / ${user.get_file_limit()}`),
			]),
		]
	}
})

const StyledUserSessions = MaokaStyled.Tags.div("flex flex-col gap-2")
const StyledUserSession = MaokaStyled.Tags.div("flex items-center gap-x-2")
const StyledSessionStatus = (active: boolean) =>
	MaokaStyled.Tags.div(`flex-shrink-0 size-3 rounded-full shadow-md ${active ? "bg-emerald-500" : "bg-neutral-500"}`)(
		() => void 0,
	)
const StyledSessionName = MaokaStyled.Tags.div("line-clamp-1 text-ellipsis")

const UserSessionsCard = StyledCard(({ use }) => {
	const get_user = use(MaokaOrdo.Jabs.User.get_current$)

	return () => {
		const user = get_user()

		if (!user) return

		return [
			StyledCardHeader(() => () => "User Sessions"),
			StyledCardBody(
				() => () =>
					user
						.get_sessions()
						.sort((a, b) => (a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0))
						.map(session =>
							StyledUserSessions(({ use }) => () => {
								const [, timestamp, agent] = session
								const current_timestamp = Date.now()

								use(MaokaJabs.set_attribute("title", agent))

								return StyledUserSession(() => () => [
									StyledSessionStatus(current_timestamp - timestamp < 60 * 1000),
									StyledSessionName(() => () => agent),
								])
							}),
						),
			),
		]
	}
})
