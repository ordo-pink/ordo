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

import { Dialog, Input } from "@ordo-pink/maoka-components"
import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

export const CreateFileModal = (ctx: Ordo.CreateFunction.Params, parent: Ordo.Metadata.FSID | null = null) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let type = "text/ordo"

		const { t } = use(MaokaOrdo.Jabs.Translations)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const t_title = t("t.file_explorer.modals.create_file.title")
		const state = { name: "" }

		return () =>
			Dialog({
				title: t_title,
				render_icon: div => void div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
				action: () => {
					emit("cmd.application.modal.hide")
					emit("cmd.metadata.create", { name: state.name, parent, type })
				},
				action_text: "OK", // TODO Translations
				body: () => [
					CreateFileModalInput(event => void (state.name = (event.target as any).value)),
					FileAssociationSelector((fa, selected_type) => {
						type = selected_type
					}),
				],
			})
	})

// TODO Extract select
// TODO Add caret showing expanded-contracted status
const FileAssociationSelector = (on_select_type: (file_association: Ordo.FileAssociation.Instance, type: string) => void) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		const select_class = "relative bg-neutral-100 shadow-inner dark:bg-neutral-600 rounded-md mt-2 cursor-pointer"

		let current_file_association: Ordo.FileAssociation.Instance | null = null
		let current_type_index = 0
		let file_associations: Ordo.FileAssociation.Instance[] = []
		let is_expanded = false

		use(MaokaJabs.set_class(select_class))

		const file_associations$ = use(MaokaOrdo.Jabs.FileAssociations$)

		const handle_item_click = (fa: Ordo.FileAssociation.Instance, type: string) => {
			is_expanded = !is_expanded
			current_file_association = fa
			current_type_index = fa.types.findIndex(t => t.name === type)
			on_select_type(fa, type)
			void refresh()
		}

		const subscription = file_associations$.subscribe(value => {
			file_associations = value
			void refresh()
		})

		const handle_escape_press = (event: KeyboardEvent) => {
			if (is_expanded && event.key === "Escape") {
				event.preventDefault()
				event.stopPropagation()

				is_expanded = false

				void refresh()
			}
		}

		document.addEventListener("keydown", handle_escape_press)

		on_unmount(() => {
			subscription.unsubscribe()
			document.removeEventListener("keydown", handle_escape_press)
		})

		return () => [
			SelectItem(
				current_file_association ? current_file_association.types[current_type_index] : file_associations[0].types[0],
				current_file_association ? current_file_association : file_associations[0],
				handle_item_click,
			),

			is_expanded
				? Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("absolute top-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-600 rounded-md"))

						return () =>
							file_associations.flatMap(file_association =>
								file_association.types.map(type => SelectItem(type, file_association, handle_item_click, true)),
							)
					})
				: void 0,
		]
	})

const SelectItem = (
	type: Ordo.FileAssociation.Type,
	file_association: Ordo.FileAssociation.Instance,
	on_click: (file_association: Ordo.FileAssociation.Instance, type: string) => void,
	is_select_active = false,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("flex gap-x-4"))
		use(MaokaJabs.listen("onclick", () => on_click(file_association, type.name)))

		const Icon = Switch.OfTrue()
			.case(!!file_association.render_icon, () =>
				Maoka.create("span", ({ element }) => file_association.render_icon!(element as HTMLElement)),
			)
			.default(() => BsFileEarmarkPlus())

		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("p-2 rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md"))

				return () => {
					if (is_select_active) use(MaokaJabs.add_class("hover:bg-neutral-300 hover:dark:bg-neutral-800"))

					return [
						Maoka.create("div", ({ use }) => {
							use(MaokaJabs.set_class("flex gap-x-1 items-center"))

							return () => [
								Icon as TMaokaElement,
								Maoka.create("div", ({ use }) => {
									const { t } = use(MaokaOrdo.Jabs.Translations)
									return () => t(type.readable_name)
								}),
							]
						}),

						Maoka.create("div", ({ use }) => {
							use(MaokaJabs.set_class("text-xs text-neutral-600 dark:text-neutral-400"))
							const { t } = use(MaokaOrdo.Jabs.Translations)
							return () => t(type.description)
						}),
					]
				}
			}),
		]
	})

const CreateFileModalInput = (handle_change: (event: Event) => void) =>
	Maoka.create("label", ({ use }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)

		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("font-bold text-sm"))
				return () => t("t.file_explorer.modals.create_file.input_label")
			}),

			Input.Text({
				placeholder: t("t.file_explorer.modals.create_file.input_placeholder"),
				autofocus: true,
				custom_class:
					"w-full rounded-md border-0 px-2 py-1 shadow-inner focus:ring-0 sm:text-sm sm:leading-6 bg-neutral-50 dark:bg-neutral-600 placeholder:text-neutral-500",
				on_input: handle_change,
			}),
		]
	})
