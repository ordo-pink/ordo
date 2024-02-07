// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsPlus, BsSearch } from "react-icons/bs"
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import Fuse from "fuse.js"

import { useAccelerator, useCommands } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import Accelerator from "@ordo-pink/frontend-react-components/accelerator"
import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import RenderFromNullable from "@ordo-pink/frontend-react-components/render-from-nullable"

type Props = {
	items: Client.CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
	multiple?: boolean
	pinnedItems?: Client.CommandPalette.Item[]
}

const fuse = new Fuse([] as Client.CommandPalette.Item[], {
	keys: ["readableName", "id"],
	threshold: 0.1,
})

export default function CommandPaletteModal({ items, onNewItem, multiple, pinnedItems }: Props) {
	const commands = useCommands()

	useAccelerator("Esc", () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"))

	const [currentIndex, setCurrentIndex] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const [pointerLocation, setPointerLocation] = useState<"selected" | "suggested">(
		pinnedItems && pinnedItems.length > 0 ? "selected" : "suggested",
	)
	const [allItems, setAllItems] = useState<Client.CommandPalette.Item[]>(items)
	const [selectedItems, setSelectedItems] = useState<Client.CommandPalette.Item[]>(
		pinnedItems ?? [],
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

		if (!!onNewItem && inputValue.length > 0 && suggestedItems.length === 0)
			setPointerLocation("suggested")
	}, [inputValue, allItems, currentIndex, onNewItem, pointerLocation, suggestedItems.length])

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnter = (index: number) => {
		Either.fromNullable(
			pointerLocation === "selected" ? selectedItems[index] : suggestedItems[index],
		).fold(
			() => {
				if (onNewItem) onNewItem(inputValue)
				if (!multiple) handleEscape()
			},
			selectedItem => {
				if (onNewItem && inputValue.length > 0 && suggestedItems.length === 0) {
					onNewItem(inputValue)
					return
				}

				selectedItem.onSelect()

				if (pointerLocation === "selected") {
					const selectedItemsCopy = [...selectedItems]
					selectedItemsCopy.splice(index, 1)
					setSelectedItems(selectedItemsCopy)
					setAllItems([selectedItem, ...suggestedItems])
				}

				if (pointerLocation === "suggested") {
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
				() => !!onNewItem && inputValue.length > 0 && suggestedItems.length === 0,
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

		commands.emit<cmd.commandPalette.hide>("command-palette.hide")
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
		<div className="max-w-screen max-h-screen sm:size-[35rem]">
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

			<div className="h-[31.5rem] overflow-y-auto px-2 py-4">
				{selectedItems.length ? (
					<div className="border-b border-neutral-500 pb-2">
						{selectedItems.map((item, index) => (
							<Item
								key={item.id}
								readableName={item.readableName}
								commandName={item.id}
								Icon={item.Icon}
								accelerator={item.accelerator}
								isCurrent={currentIndex === index && pointerLocation === "selected"}
								onSelect={() => handleEnter(index)}
							/>
						))}
					</div>
				) : null}

				<div className="pt-2">
					{suggestedItems.map((item, index) => (
						<Item
							key={item.id}
							readableName={item.readableName}
							commandName={item.id}
							Icon={item.Icon}
							accelerator={item.accelerator}
							isCurrent={currentIndex === index && pointerLocation === "suggested"}
							onSelect={() => handleEnter(index)}
						/>
					))}
				</div>

				{onNewItem && inputValue.length > 0 && suggestedItems.length === 0 ? (
					<ActionListItem
						Icon={BsPlus}
						text={`Добавить "${inputValue}"...`}
						current={true}
						onClick={() => {
							onNewItem(inputValue)
							handleEscape()
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
	useAccelerator(accelerator, onSelect)

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
