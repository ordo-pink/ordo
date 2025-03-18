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
import { MaokaStr } from "@ordo-pink/maoka-render-string"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { is_string } from "@ordo-pink/tau"
// TODO Drop state dependency
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { MetadataIcon } from "../metadata/metadata-icon.component"

import "../../maoka-components.css"

type P = { href: string; children?: TMaokaChildren; custom_class?: string; show_visited?: boolean; title?: string }
export const Link = ({ href, children, custom_class, show_visited, title }: P) =>
	Maoka.create("a", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.listen("onclick", click_listener(emit, href)))
		use(MaokaJabs.set_attribute("href", href))
		use(MaokaJabs.set_attribute("title", title))
		use(MaokaJabs.set_class("link"))

		if (custom_class) use(MaokaJabs.add_class(custom_class))
		if (!show_visited) use(MaokaJabs.add_class("link_no-history"))
		if (is_string(children)) use(MaokaJabs.set_attribute("title", children))

		return () => children
	})

export const MetadataLink = ({
	children,
	custom_class,
	show_visited,
	metadata,
	title,
}: Omit<P, "href"> & { metadata: Ordo.Metadata.Instance }) =>
	Maoka.create("span", ({ element, use }) => {
		let href = `/editor/${metadata.get_fsid()}`

		const commands = ordo_app_state.zags.select("commands")
		const user_query = ordo_app_state.zags.select("user")
		const pb_host = ordo_app_state.zags.select("hosts.pb")

		use(MaokaJabs.listen("oncontextmenu", event => handle_context_menu(event)))

		if (user_query && MaokaStr.is_maoka_str_element(element)) {
			const name = metadata.get_property("public_name")
			href = `${pb_host}/${user_query.get_handle()}/${name}`
		}

		const handle_context_menu = (event: MouseEvent) =>
			commands.emit("cmd.application.context_menu.show", { event, payload: metadata })

		return () =>
			Link({
				children: MetadataLinkWrapper(() => () => [
					MetadataIcon({ metadata, show_emoji_picker: false }),
					MetadataLinkTextWrapper(() => () => children),
				]),
				custom_class: `no-underline ${custom_class}`,
				href,
				show_visited,
				title,
			})
	})

// --- Internal ---

const MetadataLinkWrapper = MaokaStyled.Tags.div("link_wrapper")

const MetadataLinkTextWrapper = MaokaStyled.Tags.div("link link_text-wrapper")

const click_listener = (emit: Ordo.Command.Commands["emit"], url: string) => (event: MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()

	url.startsWith("/")
		? emit("cmd.application.router.navigate", { url: url as `/${string}` })
		: emit("cmd.application.router.open_external", { url, new_tab: true })
}
