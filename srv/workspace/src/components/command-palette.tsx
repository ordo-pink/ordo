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
}

const fuse = new Fuse([] as CommandPalette.Item[], { keys: ["id"], threshold: 0.1 })

export default function CommandPaletteModal({ items, onNewItem }: Props) {
	useHotkeys("Esc", () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"))

	const [currentIndex, setCurrentIndex] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const [visibleItems, setVisibleItems] = useState<CommandPalette.Item[]>([])

	useEffect(() => {
		fuse.setCollection(items)
	}, [items])

	useEffect(() => {
		if (!items) return
		if (inputValue === "") {
			setVisibleItems(items)
			return
		}

		const fusedItems = fuse.search(inputValue)

		setVisibleItems(fusedItems.map(({ item }) => item))
	}, [inputValue, items])

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const handleEnter = (index: number) => {
		Either.fromNullable(visibleItems[index]).fold(
			() => {
				if (onNewItem) onNewItem(inputValue)
				handleEscape()
			},
			selectedItem => selectedItem.onSelect(),
		)
	}

	const handleArrowUp = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()
		const isFirstItem = currentIndex === 0

		setCurrentIndex(isFirstItem ? visibleItems.length - 1 : currentIndex - 1)
	}

	const handleArrowDown = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()
		const isLastItem = currentIndex === visibleItems.length - 1

		setCurrentIndex(isLastItem ? 0 : currentIndex + 1)
	}

	const handleEscape = () => {
		setInputValue("")
		setCurrentIndex(0)
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

			<div className="px-2 py-4 overflow-y-auto h-[32rem]">
				{visibleItems.map((item, index) => (
					<Item
						key={item.id}
						readableName={item.readableName}
						commandName={item.id}
						Icon={item.Icon}
						accelerator={item.accelerator}
						isCurrent={currentIndex === index}
						onSelect={() => handleEnter(index)}
					/>
				))}

				{onNewItem && inputValue.length ? (
					<ActionListItem
						large
						Icon={BsPlus}
						text={`Add new item "${inputValue}"...`}
						current={false}
						onClick={() => {
							onNewItem(inputValue)
							handleEscape()
						}}
					/>
				) : null}
			</div>
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
