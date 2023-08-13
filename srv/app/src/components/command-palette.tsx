import Fuse from "fuse.js"
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
// import { useTranslation } from "react-i18next"
import { BsSearch } from "react-icons/bs"
import { useCommandPalette } from "../streams/command-palette"
import { Switch } from "#lib/switch/mod"
import { noop } from "#lib/tau/mod"
import { CommandPaletteItem } from "src/streams/command-palette"
import { ActionListItem } from "./action-list-item"

type Props = {
	items: CommandPaletteItem[]
}

const fuse = new Fuse([] as CommandPaletteItem[], { keys: ["name"] })

export const CommandPaletteModal = ({ items }: Props) => {
	const { hide } = useCommandPalette()

	// const { t } = useTranslation("ordo")

	useHotkeys("Esc", hide)

	const [currentIndex, setCurrentIndex] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const [visibleItems, setVisibleItems] = useState<CommandPaletteItem[]>([])

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

	const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const selectedItem = visibleItems[currentIndex]
		handleEscape()

		selectedItem.onSelect()
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
		hide()
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		Switch.of(event.key)
			.case("Escape", () => handleEscape())
			.case("Enter", () => handleEnter(event))
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
					className="w-full rounded-lg text-lg px-1 bg-transparent outline-none"
					placeholder={tSearchPlaceholder}
				/>
			</div>

			<div className="px-2 py-4 overflow-y-auto h-[32rem]">
				{visibleItems.map(({ id, name, Icon, Comment, onSelect }, index) => (
					<ActionListItem
						key={id}
						text={name}
						Icon={Icon || (() => null)}
						current={currentIndex === index}
						onClick={() => {
							handleEscape()
							onSelect()
						}}
						large
					>
						{Comment ? <Comment /> : null}
					</ActionListItem>
				))}
			</div>
		</div>
	)
}
