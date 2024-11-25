// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Label, Link, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsPlus } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { is_string } from "@ordo-pink/tau"

import { DatabaseHead } from "./components/database-head.component"
import { SortingDirection } from "./database.constants"
import { type TDatabaseState } from "./database.types"

import "./database.css"
import { Switch } from "@ordo-pink/switch"

// TODO: Avoid unnecessary rerenders by narrowing down hooks

export const Database = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	ctx: Ordo.CreateFunction.Params,
	state?: TDatabaseState,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		let database_state: TDatabaseState = state ? state : content ? JSON.parse(content as string) : {}

		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("database_view"))

		const commands = use(MaokaOrdo.Jabs.Commands)
		const get_children = use(MaokaOrdo.Jabs.Metadata.get_children(fsid))

		const on_state_change = (new_state: TDatabaseState) => {
			database_state = new_state

			commands.emit("cmd.content.set", { fsid, content_type: "database/ordo", content: JSON.stringify(database_state) })

			void refresh()
		}

		return () => {
			return [
				Maoka.create("table", ({ use }) => {
					use(MaokaJabs.set_class("w-full border-t database_border-color h-full"))

					// TODO: Move to translations
					// TODO: Add icons
					const keys: Ordo.I18N.TranslationKey[] = [
						"t.database.column_names.name",
						"t.database.column_names.labels",
						// "Links",
						// "Size",
					]

					return () => [
						DatabaseHead(keys, database_state, on_state_change),

						Maoka.create("tbody", () => {
							return () => {
								let descendents = get_children()

								Object.keys(database_state.sorting ?? {}).forEach(key => {
									const sorting_key = key as keyof typeof database_state.sorting

									if (database_state.sorting![key] == null) return

									descendents = descendents.toSorted((a, b) => {
										const x = database_state.sorting![sorting_key] === SortingDirection.ASC ? a : b
										const y = database_state.sorting![sorting_key] === SortingDirection.ASC ? b : a

										return Switch.Match(key)
											.case("t.database.column_names.name", () => x.get_name().localeCompare(y.get_name()))
											.case("t.database.column_names.labels", () => {
												const label_x = x.get_labels()[0]
												const label_y = y.get_labels()[0]
												const label_x_name = is_string(label_x) ? label_x : label_x.name
												const label_y_name = is_string(label_y) ? label_y : label_y.name

												return label_x_name.localeCompare(label_y_name)
											})
											.default(() => 1)
									})
								})

								return [
									...descendents.map(child =>
										Maoka.create("tr", ({ use }) => {
											use(MaokaJabs.set_class("border-y database_border-color h-full"))

											return () => [FileNameCell(child), LabelsCell(child.get_fsid())]
										}),
									),

									Maoka.create("tr", ({ use }) => {
										const { emit } = use(MaokaOrdo.Jabs.Commands)
										use(MaokaJabs.set_class("border-y database_border-color"))

										return () =>
											Maoka.create("td", ({ use }) => {
												use(MaokaJabs.set_class("px-2 py-1 text-neutral-500 text-sm flex gap-x-1 cursor-pointer"))

												use(
													MaokaJabs.listen("onclick", () => {
														emit("cmd.metadata.show_create_modal", metadata.get_fsid())
													}),
												)

												return () => [
													BsPlus() as TMaokaElement,
													Maoka.create("div", () => () => "New"), // TODO: i18n
												]
											})
									}),
								]
							}
						}),
					]
				}),
			]
		}
	})

// const Cell = (value: TMaokaChildren, on_click?: (event: MouseEvent) => void) =>
// 	Maoka.create("td", ({ use }) => {
// 		use(MaokaJabs.set_class("database_cell"))
// 		if (on_click) use(MaokaJabs.listen("onclick", on_click))

// 		return () => value
// 	})

const LabelsCell = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("td", ({ use }) => {
		use(MaokaJabs.set_class("flex items-start flex-wrap gap-1 p-1 size-full cursor-pointer"))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.Commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()

			return metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
		}
	})

const FileNameCell = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("td", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.Commands)

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
								const { emit } = use(MaokaOrdo.Jabs.Commands)
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
