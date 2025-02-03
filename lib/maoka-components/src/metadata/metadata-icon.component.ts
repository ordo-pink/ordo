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

import { BsFileEarmark, BsFileEarmarkBinary, BsFolderOpen } from "@ordo-pink/frontend-icons"
import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { emojis } from "@ordo-pink/emojis"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

type P = { metadata: Ordo.Metadata.Instance; custom_class?: string; show_emoji_picker?: boolean }
export const MetadataIcon = ({ metadata, custom_class = "", show_emoji_picker = true }: P) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		const icon_class = get_icon_class(custom_class)

		let emoji = metadata.get_property("emoji_icon")

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)

		const divorce_metadata_query = metadata_query.$.marry(() => {
			metadata_query
				.get_by_fsid(metadata.get_fsid())
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(R.ops.map(metadata => metadata.get_property("emoji_icon")))
				.cata(
					R.catas.if_ok(icon => {
						emoji = icon
						void refresh()
					}),
				)
		})

		on_unmount(() => divorce_metadata_query())

		use(MaokaJabs.set_class("cursor-pointer"))

		if (show_emoji_picker)
			use(
				MaokaJabs.listen("onclick", event => {
					event.stopPropagation()

					commands.emit("cmd.application.command_palette.show", {
						max_items: 100,
						on_select: item => {
							commands.emit("cmd.metadata.set_property", {
								fsid: metadata.get_fsid(),
								key: "emoji_icon",
								value: item.value,
							})
						},
						items: [
							{
								value: void 0,
								readable_name: "Remove icon" as Ordo.I18N.TranslationKey, // TODO Translation
							},
							...emojis.map(
								emoji =>
									({
										value: emoji.icon,
										readable_name: emoji.description as Ordo.I18N.TranslationKey,
										render_icon: div => void (div.innerText = emoji.icon),
									}) satisfies Ordo.CommandPalette.Item,
							),
						],
					})
				}),
			)

		return () => {
			if (emoji)
				return Maoka.create("div", ({ use }) => {
					use(MaokaJabs.set_class(custom_class, "text-[85%]"))
					return () => emoji
				})

			return metadata_query.has_children(metadata.get_fsid()).cata({
				Err: () => Icon({ metadata, custom_class: icon_class, has_children: false }),
				Ok: has_children => Icon({ metadata, custom_class: icon_class, has_children }),
			})
		}
	})

type P2 = P & { has_children: boolean }
const Icon = ({ metadata, custom_class, has_children }: P2) =>
	Maoka.create("div", ({ use, element }) => {
		const metadata_content_type = metadata.get_type()
		const get_file_associations = use(ordo_app_state.select_jab$("functions.file_assocs"))

		return async () => {
			const file_associations = get_file_associations()

			const fa = file_associations.find(association => association.types.some(type => metadata_content_type === type.name))

			use(MaokaJabs.set_class(custom_class!))

			return Switch.OfTrue()
				.case(has_children, () => BsFolderOpen(custom_class) as TMaokaElement)
				.case(metadata.get_size() === 0, () => BsFileEarmark(custom_class) as TMaokaElement)
				.case(!!fa && !!fa.render_icon, () => fa!.render_icon!(element as HTMLSpanElement))
				.default(() => BsFileEarmarkBinary(custom_class) as TMaokaElement)
		}
	})

const ICON_CLASS = "shrink-0"

const get_icon_class = (custom_class?: string) => (custom_class ? `${ICON_CLASS} ${custom_class}` : ICON_CLASS)
