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

import { Label, Link, MetadataIcon, MetadataLink } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

export const DatabaseTableRow = (columns: Ordo.I18N.TranslationKey[], child: Ordo.Metadata.Instance) =>
	Maoka.create("tr", ({ use }) => {
		use(MaokaJabs.set_class("database_table-row"))

		return () =>
			columns.map(column =>
				Switch.Match(column)
					.case("t.database.column_names.name", () => FileNameCell(child))
					.case("t.database.column_names.labels", () => LabelsCell(child.get_fsid()))
					.case("t.database.column_names.created_at", () => DateCell(child.get_created_at()))
					.case("t.database.column_names.parent", () => LinksCell(child, "parent"))
					.case("t.database.column_names.outgoing_links", () => LinksCell(child, "outgoing"))
					.case("t.database.column_names.incoming_links", () => LinksCell(child, "incoming"))
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

const LinksCell = (metadata: Ordo.Metadata.Instance, type: "parent" | "incoming" | "outgoing") =>
	Maoka.create("td", ({ use }) => {
		const fsid = metadata.get_fsid()

		use(MaokaJabs.set_class("database_cell-links"))

		if (type === "outgoing") {
			const commands = use(MaokaOrdo.Jabs.get_commands)
			const handle_click = () => commands.emit("cmd.metadata.show_edit_links_palette", fsid)

			use(MaokaJabs.add_class("clickable"))
			use(MaokaJabs.listen("onclick", () => handle_click()))
		}

		return () =>
			Switch.Match(type)
				.case("parent", () =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("database_cell-multiple"))
						const get_parent = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(metadata.get_parent()))

						return () => {
							const parent = get_parent()

							if (!parent) return
							else
								return MetadataLink({
									metadata: parent,
									href: `/editor/${parent.get_fsid()}`,
									children: parent.get_name(),
									title: parent.get_name(),
								})
						}
					}),
				)
				.case("outgoing", () =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("database_cell-multiple"))
						const get_links = use(MaokaOrdo.Jabs.Metadata.get_outgoing_links$(fsid))
						return () =>
							get_links().map(link =>
								LinkBlock(() =>
									MetadataLink({ metadata: link, href: `/editor/${link.get_fsid()}`, children: link.get_name() ?? "/" }),
								),
							)
					}),
				)
				.case("incoming", () =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("database_cell-multiple"))
						const get_links = use(MaokaOrdo.Jabs.Metadata.get_incoming_links$(metadata.get_fsid()))
						return () =>
							get_links().map(link =>
								LinkBlock(() =>
									MetadataLink({ metadata: link, href: `/editor/${link.get_fsid()}`, children: link.get_name() ?? "/" }),
								),
							)
					}),
				)
				.default(noop)
	})

const LinkBlock = Maoka.styled("span")

const LabelsCell = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("database_cell-labels"))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()

			return metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
		}
	})

const DateCell = (date: Date) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("database_cell-date"))
		use(MaokaJabs.set_attribute("title", date.toLocaleString()))

		return () => date.toDateString()
	})

const FileNameCell = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.set_class("database_cell-filename"))
		use(MaokaJabs.listen("oncontextmenu", event => handle_context_menu(event)))

		const handle_context_menu = (event: MouseEvent) => emit("cmd.application.context_menu.show", { event, payload: metadata })

		return () =>
			Maoka.create("div", ({ use }) => {
				const fsid = metadata.get_fsid()
				const name = metadata.get_name()

				const commands = use(MaokaOrdo.Jabs.get_commands)

				use(MaokaJabs.set_class("database_cell-filename-wrapper"))

				const handle_blur = (event: FocusEvent) => {
					R.FromNullable(event.target as unknown as HTMLDivElement)
						.pipe(R.ops.map(e => e.innerText))
						.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
						.cata(R.catas.if_ok(new_name => commands.emit("cmd.metadata.rename", { fsid, new_name })))
				}

				return () => [MetadataIcon({ metadata, custom_class: "pt-0.5" }), EditableLink({ fsid, name, on_blur: handle_blur })]
			})
	})

type TEditableLinkParams = { name: string; on_blur: (event: FocusEvent) => void; fsid: Ordo.Metadata.FSID }
const EditableLink = ({ name, on_blur, fsid }: TEditableLinkParams) =>
	Maoka.create("div", ({ use, element }) => {
		const handle_keydown = (event: KeyboardEvent) => {
			if (event.key !== "Enter" && event.key !== "Escape") return

			event.preventDefault()
			if (element instanceof HTMLElement) element.blur()
		}

		use(MaokaJabs.set_attribute("contenteditable", "true"))
		use(MaokaJabs.set_class("database_cell-filename-text"))
		use(MaokaJabs.listen("onkeydown", handle_keydown))
		use(MaokaJabs.listen("onblur", on_blur))

		return () => Link({ href: `/editor/${fsid}`, children: name })
	})
