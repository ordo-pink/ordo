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
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import Fuse from "fuse.js"

import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Accelerator from "@ordo-pink/frontend-react-components/accelerator"
import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import RenderFromNullable from "@ordo-pink/frontend-react-components/render-from-nullable"

type P = {
	items: Client.CommandPalette.Item[]
	on_new_item?: (newItem: string) => any
	multiple?: boolean
	pinned_items?: Client.CommandPalette.Item[]
}

export default function CommandPaletteModal({ items, on_new_item, multiple, pinned_items }: P) {
	const commands = use$.commands()

	const [currentIndex, setCurrentIndex] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const [pointerLocation, setPointerLocation] = useState<"selected" | "suggested">(
		pinned_items && pinned_items.length > 0 ? "selected" : "suggested",
	)
	const [allItems, setAllItems] = useState<Client.CommandPalette.Item[]>(items)
	const [selectedItems, setSelectedItems] = useState<Client.CommandPalette.Item[]>(
		pinned_items ?? [],
	)
	const [suggestedItems, setSuggestedItems] = useState<Client.CommandPalette.Item[]>([])

	useEffect(() => {
		fuse.setCollection(allItems)
	}, [allItems])

	useEffect(() => {
		if (!allItems) return

		if (inputValue === "") {
			setSuggestedItems(allItems)

			if (allItems.length - 1 < currentIndex && pointerLocation === "suggested") {
				setCurrentIndex(allItems.length > 0 ? allItems.length - 1 : 0)
			}

			return
		}

		const fusedItems = fuse.search(inputValue)

		setSuggestedItems(fusedItems.map(({ item }) => item))

		if (fusedItems.length - 1 < currentIndex && pointerLocation === "suggested") {
			setCurrentIndex(fusedItems.length > 0 ? fusedItems.length - 1 : 0)
		}

		if (!!on_new_item && inputValue.length > 0 && suggestedItems.length === 0)
			setPointerLocation("suggested")
	}, [inputValue, allItems, currentIndex, on_new_item, pointerLocation, suggestedItems.length])

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnter = (index: number, clickLocation?: "selected" | "suggested") => {
		const location = clickLocation ?? pointerLocation

		Either.fromNullable(
			location === "selected" ? selectedItems[index] : suggestedItems[index],
		).fold(
			() => {
				if (on_new_item) on_new_item(inputValue)
				setInputValue("")

				if (!multiple) handleEscape()
			},
			(selectedItem: Client.CommandPalette.Item) => {
				if (on_new_item && inputValue.length > 0 && suggestedItems.length === 0) {
					on_new_item(inputValue)
					setInputValue("")
					return
				}

				selectedItem.on_select()

				if (location === "selected") {
					const selectedItemsCopy = [...selectedItems]
					selectedItemsCopy.splice(index, 1)
					setSelectedItems(selectedItemsCopy)
					setAllItems([selectedItem, ...suggestedItems])
				}

				if (location === "suggested") {
					const allItemsCopy = [...allItems]
					allItemsCopy.splice(
						allItems.findIndex(v => v.id === selectedItem.id),
						1,
					)
					setAllItems(allItemsCopy)
					setSelectedItems([...selectedItems, selectedItem])
				}
			},
		)
	}

	const handleArrowUp = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()

		Switch.of(true)
			.case(
				() => !!on_new_item && inputValue.length > 0 && suggestedItems.length === 0,
				() => setPointerLocation("suggested"),
			)
			.case(
				() => currentIndex > 0,
				() => setCurrentIndex(index => index - 1),
			)
			.case(
				() => pointerLocation === "suggested" && currentIndex === 0 && selectedItems.length === 0,
				() => setCurrentIndex(suggestedItems.length - 1),
			)
			.case(
				() => pointerLocation === "selected" && currentIndex === 0 && suggestedItems.length === 0,
				() => setCurrentIndex(selectedItems.length - 1),
			)
			.case(
				() => pointerLocation === "suggested" && currentIndex === 0 && selectedItems.length > 0,
				() => {
					setPointerLocation("selected")
					setCurrentIndex(selectedItems.length - 1)
				},
			)
			.case(
				() => pointerLocation === "selected" && currentIndex === 0 && suggestedItems.length > 0,
				() => {
					setPointerLocation("suggested")
					setCurrentIndex(suggestedItems.length - 1)
				},
			)
			.default(() => setCurrentIndex(0))
	}

	const handleArrowDown = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()

		Switch.of(true)
			.case(
				() => pointerLocation === "suggested" && currentIndex < suggestedItems.length - 1,
				() => setCurrentIndex(index => index + 1),
			)
			.case(
				() => pointerLocation === "selected" && currentIndex < selectedItems.length - 1,
				() => setCurrentIndex(index => index + 1),
			)
			.case(
				() =>
					pointerLocation === "suggested" &&
					currentIndex === suggestedItems.length - 1 &&
					selectedItems.length === 0,
				() => setCurrentIndex(0),
			)
			.case(
				() =>
					pointerLocation === "selected" &&
					currentIndex === selectedItems.length - 1 &&
					suggestedItems.length === 0,
				() => setCurrentIndex(0),
			)
			.case(
				() =>
					pointerLocation === "suggested" &&
					currentIndex === suggestedItems.length - 1 &&
					selectedItems.length > 0,
				() => {
					setPointerLocation("selected")
					setCurrentIndex(0)
				},
			)
			.case(
				() =>
					pointerLocation === "selected" &&
					currentIndex === selectedItems.length - 1 &&
					suggestedItems.length > 0,
				() => {
					setPointerLocation("suggested")
					setCurrentIndex(0)
				},
			)
			.default(() => void 0)
	}

	const handleEscape = () => {
		setInputValue("")
		setCurrentIndex(0)
		setPointerLocation(selectedItems.length ? "selected" : "suggested")

		commands.emit<cmd.command_palette.hide>("command_palette.hide")
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		Switch.of(event.key)
			.case("Escape", () => handleEscape())
			.case("Enter", () => handleEnter(currentIndex))
			.case("ArrowUp", () => handleArrowUp(event))
			.case("ArrowDown", () => handleArrowDown(event))
			.default(noop)
	}

	const tSearchPlaceholder = "Поиск..."

	return (
		<div className="max-w-screen max-h-screen w-full">
			<div className="mx-2 mt-2 flex items-center space-x-2 rounded-lg bg-neutral-200 px-2 py-1 shadow-inner dark:bg-neutral-600">
				<BsSearch className="shrink-0" />
				<input
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					type="text"
					autoFocus
					className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-sm outline-none ring-0 focus:outline-none focus:ring-0"
					placeholder={tSearchPlaceholder}
				/>
			</div>

			<div className="h-[50dvh] overflow-y-auto px-2 py-4">
				{selectedItems.length ? (
					<div className="text-ellipsis border-b border-neutral-500 pb-2">
						{selectedItems.map((item, index) => (
							<Item
								key={item.id}
								readableName={item.readable_name}
								commandName={item.id}
								Icon={item.Icon}
								accelerator={item.accelerator}
								isCurrent={currentIndex === index && pointerLocation === "selected"}
								onSelect={() => handleEnter(index, "selected")}
							/>
						))}
					</div>
				) : null}

				<div className="max-w-full">
					{suggestedItems.map((item, index) => (
						<Item
							key={item.id}
							readableName={item.readable_name}
							commandName={item.id}
							Icon={item.Icon}
							accelerator={item.accelerator}
							isCurrent={currentIndex === index && pointerLocation === "suggested"}
							onSelect={() => handleEnter(index, "suggested")}
						/>
					))}
				</div>

				{on_new_item && inputValue.length > 0 && suggestedItems.length === 0 ? (
					<ActionListItem
						Icon={BsPlus}
						text={`Добавить "${inputValue}"...`}
						current={true}
						onClick={() => {
							on_new_item(inputValue)
							setInputValue("")
							if (!multiple) handleEscape()
						}}
					/>
				) : null}
			</div>

			{multiple ? (
				<div className="text-center text-sm text-neutral-500">
					Нажмите <Accelerator inline accelerator="Esc" /> для завершения
				</div>
			) : null}
		</div>
	)
}

const Item = ({ commandName, readableName, Icon, accelerator, isCurrent, onSelect }: any) => {
	use$.accelerator(accelerator, onSelect)

	return (
		<ActionListItem
			large
			key={commandName}
			text={readableName}
			Icon={Icon || (() => null)}
			current={isCurrent}
			onClick={onSelect}
		>
			<RenderFromNullable having={accelerator}>
				<Accelerator accelerator={accelerator} />
			</RenderFromNullable>
		</ActionListItem>
	)
}

const fuse = new Fuse([] as Client.CommandPalette.Item[], {
	keys: ["readableName", "id"],
	threshold: 0.1,
})
