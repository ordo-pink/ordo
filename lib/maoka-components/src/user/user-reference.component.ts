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

import { BsCaretRight } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"

// TODO: Lead to user page
// TODO: Get actual user (id: string) =>
export const CurrentUserReference = Maoka.create("div", ({ use, refresh }) => {
	let name = ""

	use(maoka_jabs.set_class("flex gap-x-2 items-center text-sm"))

	const user_query = use(MaokaOrdo.Jabs.get_user_query)

	const divorce_user_query_version = user_query.$.marry(() =>
		user_query
			.get_current()
			.pipe(R.ops.chain(R.FromNullable))
			.pipe(R.ops.map(user => void (name = user.get_readable_name())))
			.cata(R.catas.if_ok(refresh)),
	)

	use(MaokaDOM.Jabs.onunmount(() => divorce_user_query_version()))

	return () => [UserAvatar, UserName(name)]
})

const StyledUserReference = MaokaStyled.Tags.div("flex gap-x-2 items-center text-sm")
export const UserReference = (user: Ordo.User.Public.Instance | null) =>
	user
		? StyledUserReference(() => () => [UserAvatar, UserName(user.get_readable_name())])
		: StyledUserReference(() => () => [UserAvatar, UserName("John Doe")])

const user_avatar_class = [
	"flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 shadow-lg",
	"bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400",
]

export const UserAvatar = Maoka.create("div", ({ use }) => {
	use(maoka_jabs.set_class(...user_avatar_class))

	return () =>
		Maoka.create("div", ({ use }) => {
			use(maoka_jabs.set_class("rounded-full bg-neutral-500"))

			return () => UserAvatarIcon
		})
})

const UserAvatarIcon = Maoka.create("div", ({ use }) => {
	use(maoka_jabs.set_class("size-3 rounded-full text-xs"))

	// TODO: User icon
	return () => BsCaretRight("size-3 white")
})

export const UserName = (name: string) =>
	Maoka.create("div", ({ use }) => {
		use(maoka_jabs.set_class(highlight_first_letter_class))

		return () => name
	})

// --- Internal ---

const highlight_first_letter_class =
	"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent text-nowrap"
