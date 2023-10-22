// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { BsPlus, BsSearch } from "react-icons/bs"
import Fuse from "fuse.js"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"
import { useAccelerator } from "$hooks/use-accelerator"
import { getCommands } from "$streams/commands"
import RenderFromNullable from "$components/render-from-nullable"
import ActionListItem from "$components/action-list-item"
import Accelerator from "$components/accelerator"
import { CommandPalette, cmd } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"

const commands = getCommands()

type Props = {
	items: CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
	multiple?: boolean
	pinnedItems?: CommandPalette.Item[]
}

const fuse = new Fuse([] as CommandPalette.Item[], { keys: ["id"], threshold: 0.1 })

export default function CommandPaletteModal({ items, onNewItem, multiple, pinnedItems }: Props) {
	useHotkeys("Esc", () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"))

	const [currentIndex, setCurrentIndex] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const [pointerLocation, setPointerLocation] = useState<"selected" | "suggested">(
		pinnedItems && pinnedItems.length > 0 ? "selected" : "suggested",
	)
	const [allItems, setAllItems] = useState<CommandPalette.Item[]>(items)
	const [selectedItems, setSelectedItems] = useState<CommandPalette.Item[]>(pinnedItems ?? [])
	const [suggestedItems, setSuggestedItems] = useState<CommandPalette.Item[]>([])

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

	const tSearchPlaceholder = "Search"

	return (
		<div className="w-[35rem] max-w-full h-[35rem] max-h-screen">
			<div className="flex space-x-2 items-center mx-2 mt-2 px-2 py-1 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-inner">
				<BsSearch className="shrink-0" />
				<input
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					type="text"
					autoFocus
					className="w-full rounded-lg px-2 py-1 text-sm bg-transparent focus:outline-none border-none"
					placeholder={tSearchPlaceholder}
				/>
			</div>

			<div className="px-2 py-4 overflow-y-auto h-[31.5rem]">
				{selectedItems.length ? (
					<div className="pb-2 border-b border-neutral-500">
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
						large
						Icon={BsPlus}
						text={`Add new item "${inputValue}"...`}
						current={true}
						onClick={() => {
							onNewItem(inputValue)
							handleEscape()
						}}
					/>
				) : null}
			</div>

			{multiple ? (
				<div className="text-center text-neutral-500 text-sm">
					Press <strong>ESC</strong> to complete
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
				<Accelerator accelerator={accelerator!} />
			</RenderFromNullable>
		</ActionListItem>
	)
}
