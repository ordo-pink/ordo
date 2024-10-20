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

import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BS_FILE_EARMARK_PLUS } from "@ordo-pink/frontend-icons"
import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { Button } from "@ordo-pink/maoka-components"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

export const CreateFileModal = (
	ctx: Ordo.CreateFunction.Params,
	parent: Ordo.Metadata.FSID | null = null,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("p-4 w-96 flex flex-col gap-y-2"))

		let type = "text/ordo"

		const { t } = use(MaokaOrdo.Jabs.Translations)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const t_title = t("t.file_explorer.modals.create_file.title")
		const state = { name: "" }

		return () => [
			Header(() => [TitleIcon, Title(() => t_title)]),
			Body(() => [
				CreateFileModalInput(event => void (state.name = (event.target as any).value)),
				FileAssociationSelector((fa, selected_type) => {
					type = selected_type
				}),
			]),
			Footer(() => [
				Button.Neutral({
					on_click: () => emit("cmd.application.modal.hide"),
					text: "Cancel",
					accelerator: "escape",
				}),
				Button.Success({
					on_click: () => {
						emit("cmd.application.modal.hide")
						emit("cmd.metadata.create", { name: state.name, parent, type })
					},
					text: "OK",
					accelerator: "shift+enter",
				}),
			]),
		]
	})

const Header = Maoka.styled("div", { class: "flex gap-x-2 items-center" })

const Title = Maoka.styled("h2", { class: "text-lg" })

const Body = Maoka.styled("div")

const Footer = Maoka.styled("div", { class: "flex justify-end items-center gap-x-2" })

const TitleIcon = Maoka.create("div", ({ use }) =>
	use(MaokaJabs.set_inner_html(BS_FILE_EARMARK_PLUS)),
)

// TODO Extract select
// TODO Add caret showing expanded-contracted status
const FileAssociationSelector = (
	on_select_type: (file_association: Ordo.FileAssociation.Instance, type: string) => void,
) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		const select_class =
			"relative bg-neutral-200 dark:bg-neutral-600 rounded-md mt-2 cursor-pointer"

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
				current_file_association
					? current_file_association.types[current_type_index]
					: file_associations[0].types[0],
				current_file_association ? current_file_association : file_associations[0],
				handle_item_click,
			),

			is_expanded
				? Maoka.create("div", ({ use }) => {
						use(
							MaokaJabs.set_class(
								"absolute top-0 left-0 right-0 bg-neutral-200 dark:bg-neutral-600 rounded-md",
							),
						)

						return () =>
							file_associations.flatMap(file_association =>
								file_association.types.map(type =>
									SelectItem(type, file_association, handle_item_click, true),
								),
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
				Maoka.create("span", ({ element }) =>
					file_association.render_icon!(element as HTMLElement),
				),
			)
			.default(() => BsFileEarmarkPlus())

		return () => [
			Maoka.create("div", ({ use }) => {
				use(
					MaokaJabs.set_class(
						"p-2 rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md",
					),
				)

				return () => {
					if (is_select_active)
						use(MaokaJabs.add_class("hover:bg-neutral-300 hover:dark:bg-neutral-800"))

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
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("font-bold text-sm"))
				const { t } = use(MaokaOrdo.Jabs.Translations)

				return () => t("t.file_explorer.modals.create_file.input_label")
			}),

			Maoka.create("input", ({ use, element }) => {
				const { t } = use(MaokaOrdo.Jabs.Translations)

				use(MaokaJabs.listen("oninput", handle_change))
				use(MaokaJabs.set_attribute("autofocus", "autofocus"))
				use(
					MaokaJabs.set_attribute(
						"placeholder",
						t("t.file_explorer.modals.create_file.input_placeholder"),
					),
				)

				use(
					MaokaJabs.set_class(
						"w-full rounded-md border-0 px-2 py-1 shadow-inner focus:ring-0 sm:text-sm sm:leading-6",
						"bg-neutral-50 dark:bg-neutral-600 placeholder:text-neutral-500",
					),
				)

				if (element instanceof HTMLElement) element.focus()
			}),
		]
	})
