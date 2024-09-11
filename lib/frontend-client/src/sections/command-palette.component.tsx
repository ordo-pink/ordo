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

import { BsPlus, BsSearch } from "react-icons/bs"
import { ChangeEvent, ComponentType, KeyboardEvent, useEffect, useState } from "react"
import Fuse from "fuse.js"
import { IconType } from "react-icons"

import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Accelerator from "@ordo-pink/frontend-react-components/accelerator"
import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"

type P = {
	items: Client.CommandPalette.Item[]
	on_new_item?: (newItem: string) => any
	multiple?: boolean
	pinned_items?: Client.CommandPalette.Item[]
	shows_next_palette?: boolean
}
export default function CommandPaletteModal({
	items,
	on_new_item,
	multiple,
	pinned_items,
	shows_next_palette,
}: P) {
	const commands = use$.commands()
	const translate = use$.translation()

	const [current_index, set_current_index] = useState(0)
	const [input_value, set_input_value] = useState("")
	const [pointer_location, set_pointer_location] = useState<"selected" | "suggested">(
		pinned_items && pinned_items.length > 0 ? "selected" : "suggested",
	)
	const [all_items, set_all_items] = useState<Client.CommandPalette.Item[]>(items)
	const [selected_items, set_selected_items] = useState<Client.CommandPalette.Item[]>(
		pinned_items ? pinned_items : [],
	)
	const [suggested_items, set_suggested_items] = useState<Client.CommandPalette.Item[]>([])

	useEffect(() => {
		fuse.setCollection(
			all_items.map(item => ({ ...item, translation: translate(item.readable_name) })),
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [all_items, translate])

	useEffect(() => {
		if (!all_items) return

		if (input_value === "") {
			set_suggested_items(all_items)

			if (all_items.length - 1 < current_index && pointer_location === "suggested") {
				set_current_index(all_items.length > 0 ? all_items.length - 1 : 0)
			}

			return
		}

		const fused_items = fuse.search(input_value)

		set_suggested_items(fused_items.map(({ item }) => item))

		if (fused_items.length - 1 < current_index && pointer_location === "suggested") {
			set_current_index(fused_items.length > 0 ? fused_items.length - 1 : 0)
		}

		if (!!on_new_item && input_value.length > 0 && suggested_items.length === 0)
			set_pointer_location("suggested")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input_value, all_items, current_index, on_new_item, pointer_location, suggested_items.length])

	const on_input_change = (event: ChangeEvent<HTMLInputElement>) =>
		set_input_value(event.target.value)

	const on_enter = (index: number, click_location?: "selected" | "suggested") => {
		const location = click_location ?? pointer_location

		Either.fromNullable(
			location === "selected" ? selected_items[index] : suggested_items[index],
		).fold(
			() => {
				if (on_new_item) on_new_item(input_value)
				set_input_value("")

				if (!multiple) on_escape()
				if (!shows_next_palette) commands.emit("cmd.application.command_palette.hide")
			},
			(selected_item: Client.CommandPalette.Item) => {
				if (on_new_item && input_value.length > 0 && suggested_items.length === 0) {
					on_new_item(input_value)
					set_input_value("")

					return
				}

				if (!multiple) {
					selected_item.on_select()

					on_escape()
					if (!shows_next_palette) commands.emit("cmd.application.command_palette.hide")
					return
				}

				selected_item.on_select()

				if (location === "selected") {
					const selected_items_copy = [...selected_items]
					selected_items_copy.splice(index, 1)

					set_selected_items(selected_items_copy)
					set_all_items([selected_item, ...suggested_items])
				}

				if (location === "suggested") {
					const all_items_copy = [...all_items]
					all_items_copy.splice(
						all_items.findIndex(v => v.id === selected_item.id),
						1,
					)

					set_all_items(all_items_copy)
					set_selected_items([...selected_items, selected_item])
				}
			},
		)
	}

	const on_arrow_up = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()

		Switch.OfTrue()
			.case(
				() => !!on_new_item && input_value.length > 0 && suggested_items.length === 0,
				() => set_pointer_location("suggested"),
			)
			.case(
				() => current_index > 0,
				() => set_current_index(index => index - 1),
			)
			.case(
				() =>
					pointer_location === "suggested" && current_index === 0 && selected_items.length === 0,
				() => set_current_index(suggested_items.length - 1),
			)
			.case(
				() =>
					pointer_location === "selected" && current_index === 0 && suggested_items.length === 0,
				() => set_current_index(selected_items.length - 1),
			)
			.case(
				() => pointer_location === "suggested" && current_index === 0 && selected_items.length > 0,
				() => {
					set_pointer_location("selected")
					set_current_index(selected_items.length - 1)
				},
			)
			.case(
				() => pointer_location === "selected" && current_index === 0 && suggested_items.length > 0,
				() => {
					set_pointer_location("suggested")
					set_current_index(suggested_items.length - 1)
				},
			)
			.default(() => set_current_index(0))
	}

	const on_arrow_down = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()

		Switch.of(true)
			.case(
				() => pointer_location === "suggested" && current_index < suggested_items.length - 1,
				() => set_current_index(index => index + 1),
			)
			.case(
				() => pointer_location === "selected" && current_index < selected_items.length - 1,
				() => set_current_index(index => index + 1),
			)
			.case(
				() =>
					pointer_location === "suggested" &&
					current_index === suggested_items.length - 1 &&
					selected_items.length === 0,
				() => set_current_index(0),
			)
			.case(
				() =>
					pointer_location === "selected" &&
					current_index === selected_items.length - 1 &&
					suggested_items.length === 0,
				() => set_current_index(0),
			)
			.case(
				() =>
					pointer_location === "suggested" &&
					current_index === suggested_items.length - 1 &&
					selected_items.length > 0,
				() => {
					set_pointer_location("selected")
					set_current_index(0)
				},
			)
			.case(
				() =>
					pointer_location === "selected" &&
					current_index === selected_items.length - 1 &&
					suggested_items.length > 0,
				() => {
					set_pointer_location("suggested")
					set_current_index(0)
				},
			)
			.default(() => void 0)
	}

	const on_escape = () => {
		if (!suggested_items[current_index].shows_next_palette)
			commands.emit("cmd.application.command_palette.hide")

		set_input_value("")
		set_current_index(0)
		set_pointer_location(selected_items.length ? "selected" : "suggested")
	}

	const on_key_down = (event: KeyboardEvent<HTMLInputElement>) =>
		void Switch.of(event.key)
			.case("Escape", () => on_escape())
			.case("Enter", () => on_enter(current_index))
			.case("ArrowUp", () => on_arrow_up(event))
			.case("ArrowDown", () => on_arrow_down(event))
			.default(noop)

	const t_search_placeholder = translate("t.common.components.command_palette.search_placeholder")
	const t_command_palette_press_to_exit = translate(
		"t.common.components.command_palette.exit_key_hint",
	)

	return (
		<div className="max-w-screen max-h-screen w-[45rem]">
			<div className="mx-2 mt-2 flex items-center space-x-2 rounded-lg bg-neutral-200 px-2 py-1 shadow-inner dark:bg-neutral-600">
				<BsSearch className="shrink-0" />
				<input
					value={input_value}
					onChange={on_input_change}
					onKeyDown={on_key_down}
					type="text"
					autoFocus
					className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:outline-none focus:ring-0"
					placeholder={t_search_placeholder}
				/>
			</div>

			<div className="h-[50dvh] w-full overflow-y-auto px-2 py-4">
				{selected_items.length ? (
					<div className="text-ellipsis border-b border-neutral-500 pb-2">
						{selected_items.map((item, index) => (
							<Item
								key={item.id}
								readable_name={item.readable_name}
								command_name={item.id}
								Icon={item.Icon}
								accelerator={item.accelerator}
								is_current={current_index === index && pointer_location === "selected"}
								on_select={() => on_enter(index, "selected")}
							/>
						))}
					</div>
				) : null}

				<div className="max-w-full">
					{suggested_items.map((item, index) => (
						<Item
							key={item.id}
							readable_name={item.readable_name}
							command_name={item.id}
							Icon={item.Icon}
							accelerator={item.accelerator}
							is_current={current_index === index && pointer_location === "suggested"}
							on_select={() => on_enter(index, "suggested")}
						/>
					))}
				</div>

				{on_new_item && input_value.length > 0 && suggested_items.length === 0 ? (
					<ActionListItem
						Icon={BsPlus}
						text={`Добавить "${input_value}"...`}
						current={true}
						onClick={() => {
							on_new_item(input_value)
							set_input_value("")
							if (!multiple) on_escape()
						}}
					/>
				) : null}
			</div>

			{multiple ? (
				<div className="text-center text-sm text-neutral-500">
					<Accelerator inline accelerator="Esc" /> {t_command_palette_press_to_exit}
				</div>
			) : null}
		</div>
	)
}

type TItemP = {
	command_name: string
	readable_name: keyof TFlatTranslations
	Icon?: ComponentType | IconType
	accelerator?: string
	is_current: boolean
	on_select: () => void
}
const Item = ({
	command_name,
	readable_name,
	Icon,
	accelerator,
	is_current,
	on_select,
}: TItemP) => {
	use$.accelerator(accelerator, on_select)
	const translate = use$.translation()

	const t_readable_name = translate(readable_name)

	return (
		<ActionListItem
			large
			key={command_name}
			text={t_readable_name}
			Icon={Icon || (() => null)}
			current={is_current}
			onClick={on_select}
		>
			{accelerator ? <Accelerator accelerator={accelerator} /> : null}
		</ActionListItem>
	)
}

// --- Internal ---

const fuse = new Fuse([] as Client.CommandPalette.Item[], {
	keys: ["translation"],
	threshold: 0.3,
})
