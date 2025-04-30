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

import { Label, Link, MetadataIcon, MetadataLink, UserReference } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"
import { sweech } from "@ordo-pink/sweech"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { database$ } from "../database.state"

export const DatabaseTableRow = (columns: Ordo.I18N.TranslationKey[], child: Ordo.Metadata.Instance, is_editable: boolean) =>
	Maoka.create("tr", ({ use }) => {
		use(maoka_jabs.set_class("database_table-row"))

		return () =>
			columns.map(column =>
				sweech
					.match(column)
					.case("t.database.column_names.name", () => FileNameCell(child, is_editable))
					.case("t.database.column_names.labels", () => LabelsCell(child.get_fsid()))
					.case("t.database.column_names.created_at", () => DateCell(column, child.get_created_at()))
					.case("t.database.column_names.parent", () => LinksCell(column, child, "parent"))
					.case("t.database.column_names.outgoing_links", () => LinksCell(column, child, "outgoing"))
					.case("t.database.column_names.incoming_links", () => LinksCell(column, child, "incoming"))
					.case("t.database.column_names.created_by", () => UserCell(column, child))
					.default(() => Cell("TODO")),
			)
	})

// --- Internal ---

const UserCellWrapper = MaokaStyled.Tags.td("database_cell")
const UserCell = (column: string, metadata: Ordo.Metadata.Instance) =>
	UserCellWrapper(({ use }) => {
		const width_state = database$.select("width")
		const width = width_state?.[column] ?? 200

		use(maoka_jabs.set_style({ width: `${width}px` }))

		const user_query = use(MaokaOrdo.Jabs.get_user_query)

		use(MaokaOrdo.Jabs.happy_marriage$(user_query.$))

		return () =>
			oath
				.from_nullable(metadata.get_created_by())
				.pipe(oath.ops.and(id => user_query.get_by_id(id)))
				.pipe(oath.ops.and(oath.from_nullable))
				.pipe(oath.ops.and(user => UserReference(user)))
				.cata(oath.catas.or_else(noop))
	})

const Cell = (value: TMaokaChildren, on_click?: (event: MouseEvent) => void) =>
	Maoka.create("td", ({ use }) => {
		use(maoka_jabs.set_class("database_cell"))
		if (on_click) use(maoka_jabs.listen("onclick", on_click))

		return () => value
	})

const LinksCell = (column: string, metadata: Ordo.Metadata.Instance, type: "parent" | "incoming" | "outgoing") =>
	Maoka.create("td", ({ use }) => {
		const width_state = database$.select("width")
		const width = width_state?.[column] ?? 200

		use(maoka_jabs.set_style({ width: `${width}px` }))

		const fsid = metadata.get_fsid()

		use(maoka_jabs.set_class("database_cell-links"))

		if (type === "outgoing") {
			const commands = use(MaokaOrdo.Jabs.get_commands)
			const handle_click = () => commands.emit("cmd.metadata.show_edit_links_palette", { fsid, type })

			if (use(MaokaDOM.Jabs.is_dom)) use(maoka_jabs.add_class("clickable"))
			use(maoka_jabs.listen("onclick", () => handle_click()))
		} else if (type === "incoming") {
			const commands = use(MaokaOrdo.Jabs.get_commands)
			const handle_click = () => commands.emit("cmd.metadata.show_edit_links_palette", { fsid, type })

			if (use(MaokaDOM.Jabs.is_dom)) use(maoka_jabs.add_class("clickable"))
			use(maoka_jabs.listen("onclick", () => handle_click()))
		}

		return () =>
			sweech
				.match(type)
				.case("parent", () =>
					Maoka.create("div", ({ use }) => {
						use(maoka_jabs.set_class("database_cell-multiple"))
						const get_parent = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(metadata.get_parent()))

						return () => {
							const parent = get_parent()

							if (!parent) return
							else return MetadataLink({ metadata: parent, children: parent.get_name(), title: parent.get_name() })
						}
					}),
				)
				.case("outgoing", () =>
					Maoka.create("div", ({ use }) => {
						use(maoka_jabs.set_class("database_cell-multiple"))
						const get_links = use(MaokaOrdo.Jabs.Metadata.get_outgoing_links$(fsid))
						return () =>
							get_links().map(link => LinkBlock(() => () => MetadataLink({ metadata: link, children: link.get_name() ?? "/" })))
					}),
				)
				.case("incoming", () =>
					Maoka.create("div", ({ use }) => {
						use(maoka_jabs.set_class("database_cell-multiple"))
						const get_links = use(MaokaOrdo.Jabs.Metadata.get_incoming_links$(metadata.get_fsid()))
						return () =>
							get_links().map(link => LinkBlock(() => () => MetadataLink({ metadata: link, children: link.get_name() ?? "/" })))
					}),
				)
				.default(noop)
	})

const LinkBlock = MaokaStyled.Tags.span()

const LabelsCell = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("td", ({ use }) => {
		const width_state = database$.select("width")
		const width = width_state?.["t.database.column_names.labels"] ?? 200

		use(maoka_jabs.set_style({ width: `${width}px` }))

		use(maoka_jabs.set_class("database_cell-multiple database_cell-labels"))
		use(maoka_jabs.listen("onclick", () => handle_click()))
		if (use(MaokaDOM.Jabs.is_dom)) use(maoka_jabs.add_class("clickable"))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()

			return metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
		}
	})

const DateCell = (column: string, date: Date) =>
	Maoka.create("td", ({ use }) => {
		const width_state = database$.select("width")
		const width = width_state?.[column] ?? 200

		use(maoka_jabs.set_style({ width: `${width}px` }))

		use(maoka_jabs.set_class("database_cell-date"))
		use(maoka_jabs.set_attribute("title", date.toLocaleString()))

		return () => date.toLocaleDateString()
	})

const FileNameCell = (metadata: Ordo.Metadata.Instance, is_editable: boolean) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands)
		const width_state = database$.select("width")
		const width = width_state?.["t.database.column_names.name"] ?? 300

		use(maoka_jabs.set_class("database_cell-filename"))
		use(maoka_jabs.set_style({ width: `${width}px` }))
		use(maoka_jabs.listen("oncontextmenu", event => handle_context_menu(event)))

		const handle_context_menu = (event: MouseEvent) => emit("cmd.application.context_menu.show", { event, payload: metadata })

		return () =>
			Maoka.create("div", ({ use }) => {
				const fsid = metadata.get_fsid()
				const name = metadata.get_name()

				const commands = use(MaokaOrdo.Jabs.get_commands)

				use(maoka_jabs.set_class("database_cell-filename-wrapper"))

				const handle_blur = (event: FocusEvent) => {
					R.FromNullable(event.target as unknown as HTMLDivElement)
						.pipe(R.ops.map(e => e.innerText))
						.pipe(R.ops.chain(new_name => R.If(name !== new_name, { T: () => new_name })))
						.cata(R.catas.if_ok(new_name => commands.emit("cmd.metadata.rename", { fsid, new_name })))
				}

				return () => [
					MetadataIcon({ metadata, custom_class: "pt-0.5" }),
					EditableLink({ fsid, name, on_blur: handle_blur, is_editable }),
				]
			})
	})

type TEditableLinkParams = {
	name: string
	is_editable: boolean
	on_blur: (event: FocusEvent) => void
	fsid: Ordo.Metadata.FSID
}
const EditableLink = ({ name, on_blur, is_editable, fsid }: TEditableLinkParams) =>
	Maoka.create("div", ({ use, element }) => {
		const handle_keydown = (event: KeyboardEvent) => {
			if (event.key !== "Enter" && event.key !== "Escape") return

			event.preventDefault()
			if (element instanceof HTMLElement) element.blur()
		}

		use(maoka_jabs.set_class("database_cell-filename-text"))
		use(maoka_jabs.listen("onkeydown", handle_keydown))
		use(maoka_jabs.listen("onblur", on_blur))
		if (is_editable) use(maoka_jabs.set_attribute("contenteditable", "true"))

		return () => Link({ href: `/editor/${fsid}`, children: name })
	})
