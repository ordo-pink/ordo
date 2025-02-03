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

import { Maoka, TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { is_string } from "@ordo-pink/tau"

import { MetadataIcon } from "../metadata/metadata-icon.component"

type P = { href: `/${string}`; children?: TMaokaChildren; custom_class?: string; show_visited?: boolean; title?: string }
export const Link = ({ href, children, custom_class, show_visited, title }: P) =>
	Maoka.create("a", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.listen("onclick", click_listener(emit, href)))
		use(MaokaJabs.set_attribute("href", href))
		use(MaokaJabs.set_attribute("title", title))
		use(MaokaJabs.set_class(default_class))

		if (custom_class) use(MaokaJabs.add_class(custom_class))
		if (!show_visited) use(MaokaJabs.add_class(ignore_history_highlighting_class))
		if (is_string(children)) use(MaokaJabs.set_attribute("title", children))

		return () => children
	})

export const MetadataLink = ({
	href,
	children,
	custom_class,
	show_visited,
	metadata,
	title,
}: P & { metadata: Ordo.Metadata.Instance }) =>
	Link({
		children: MetadataLinkWrapper(() => [
			MetadataIcon({ metadata, show_emoji_picker: false }),
			MetadataLinkTextWrapper(() => children),
		]),
		custom_class: `no-underline ${custom_class}`,
		href,
		show_visited,
		title,
	})

// --- Internal ---

const default_class =
	"underline transition-all hover:text-rose-600 dark:hover:text-rose-300 rounded-sm cursor-pointer decoration-neutral-500/50 hover:decoration-rose-500/50 decoration-1 underline-offset-2"

const MetadataLinkWrapper = Maoka.styled("div", { class: "w-fit flex items-center gap-x-1" })

const MetadataLinkTextWrapper = Maoka.styled("div", { class: `${default_class} text-ellipsis line-clamp-1` })

const click_listener = (emit: Ordo.Command.Commands["emit"], url: `/${string}`) => (event: MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()

	emit("cmd.application.router.navigate", { url })
}

const ignore_history_highlighting_class = "text-inherit visited:text-inherit"
