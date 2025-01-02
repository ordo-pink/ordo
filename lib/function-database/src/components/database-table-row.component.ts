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

import { Label, Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

export const DatabaseTableRow = (keys: Ordo.I18N.TranslationKey[], child: Ordo.Metadata.Instance) =>
	Maoka.create("tr", ({ use }) => {
		use(MaokaJabs.set_class("border-y database_border-color h-full"))

		return () =>
			keys.map(key =>
				Switch.Match(key)
					.case("t.database.column_names.name", () => FileNameCell(child))
					.case("t.database.column_names.labels", () => LabelsCell(child.get_fsid()))
					.case("t.database.column_names.created_at", () => DateCell(child.get_created_at()))
					.default(() => Cell("TODO")),
			)
	})

// --- Internal ---

const Cell = (value: TMaokaChildren, on_click?: (event: MouseEvent) => void) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("database_cell"))
		if (on_click) use(MaokaJabs.listen("onclick", on_click))

		return () => value
	})

const LabelsCell = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("flex items-start flex-wrap gap-1 p-1 size-full cursor-pointer"))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands.get)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()

			return metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
		}
	})

const DateCell = (date: Date) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("text-xs p-1 border database_border-color text-neutral-500 cursor-default"))
		use(MaokaJabs.set_attribute("title", date.toLocaleString()))

		return () => date.toDateString()
	})

const FileNameCell = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands.get)

		const handle_context_menu = (event: MouseEvent) => emit("cmd.application.context_menu.show", { event, payload: metadata })

		use(MaokaJabs.set_class("database_cell font-semibold"))
		use(MaokaJabs.listen("oncontextmenu", handle_context_menu))

		return () =>
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("flex items-start h-full"))

				return () =>
					Maoka.create("div", ({ use }) => {
						const fsid = metadata.get_fsid()
						const name = metadata.get_name()

						use(MaokaJabs.set_class("flex gap-x-1 items-center"))

						return () => [
							MetadataIcon({ metadata }),

							Maoka.create("div", ({ use, element }) => {
								const { emit } = use(MaokaOrdo.Jabs.get_commands.get)
								const keydown_listener = MaokaJabs.listen("onkeydown", event => {
									if (event.key !== "Enter" && event.key !== "Escape") return

									event.preventDefault()
									if (element instanceof HTMLElement) element.blur()
								})

								const blur_listener = MaokaJabs.listen("onblur", event => {
									R.FromNullable(event.target as unknown as HTMLDivElement)
										.pipe(R.ops.map(e => e.innerText))
										.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
										.cata(R.catas.if_ok(new_name => emit("cmd.metadata.rename", { fsid, new_name })))
								})

								use(MaokaJabs.set_attribute("contenteditable", "true"))
								use(MaokaJabs.set_class("w-full outline-none"))
								use(keydown_listener)
								use(blur_listener)

								return () => Link({ href: `/editor/${metadata.get_fsid()}`, children: name })
							}),
						]
					})
			})
	})
