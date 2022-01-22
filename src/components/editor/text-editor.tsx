import React from "react"
import { useAppSelector } from "../../common/store-hooks"
import { Selection, SelectionBoundary } from "../../application/types"

export interface CaretPosition {
	line: number
	index: number
}

export interface ChangeSelection {
	start: CaretPosition
	end: CaretPosition
	direction: "ltr" | "rtl"
}

export interface ChangeKeys {
	key: string
	metaKey: boolean
	ctrlKey: boolean
	shiftKey: boolean
	altKey: boolean
}

export interface Change {
	selection: ChangeSelection
	keys?: ChangeKeys
}

export interface ChangeResponse extends Change {
	content: string[]
}

const selectionExists = (selection: ChangeSelection) =>
	selection.start.index !== selection.end.index || selection.start.line !== selection.end.line

const checkIsInSelection = (selection: ChangeSelection, charIndex: number, lineIndex: number) => {
	const exists = selectionExists(selection)
	const betweenSelectedLines = exists && lineIndex > selection.start.line && lineIndex < selection.end.line
	const onLastSelectedLine =
		exists &&
		selection.start.line !== selection.end.line &&
		lineIndex === selection.end.line &&
		charIndex < selection.end.index
	const onFirstSelectedLine =
		exists &&
		selection.start.line !== selection.end.line &&
		lineIndex === selection.start.line &&
		charIndex >= selection.start.index
	const onlyOneLineSelected =
		selection.start.index !== selection.end.index &&
		selection.start.line === selection.end.line &&
		lineIndex === selection.start.line &&
		charIndex >= selection.start.index &&
		charIndex < selection.end.index

	return betweenSelectedLines || onLastSelectedLine || onFirstSelectedLine || onlyOneLineSelected
}

export const Char = React.memo<{
	value: string
	lineIndex: number
	charIndex: number
	mouseUpHandler: (charIndex: number, lineIndex: number) => void
	mouseDownHandler: (charIndex: number, lineIndex: number) => void
	selection: ChangeSelection
}>(({ value, charIndex, lineIndex, mouseUpHandler, mouseDownHandler, selection }) => {
	const ref = React.useRef<HTMLSpanElement>(null)

	const onMouseUp = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation()
		e.preventDefault()

		ref.current && ref.current.classList.add("caret")

		mouseUpHandler(charIndex, lineIndex)
	}

	const onMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation()
		e.preventDefault()

		mouseDownHandler(charIndex, lineIndex)
	}

	const onMouseOver = (e: React.MouseEvent<HTMLSpanElement>) => {
		if (e.buttons === 1) {
			onMouseUp(e)
		}
	}

	const isInSelection = checkIsInSelection(selection, charIndex, lineIndex)

	let className = ""

	if (selectionExists(selection) && isInSelection) {
		className += "editor-selection bg-pink-200 "
	}

	if (value === "\t") {
		className += "tab text-pink-400 "
	}

	if (value === " ") {
		className += "space text-pink-400 "
	}

	if (value === "\n") {
		className += "new-line "
	}

	return (
		<span
			ref={ref}
			style={{
				display: "inline-block",
				whiteSpace: "pre",
			}}
			className={`text-gray-900 ${className}`}
			data-index={`line-${lineIndex}-${charIndex}`}
			id={`line-${lineIndex}-${charIndex}`}
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
			onMouseOver={onMouseOver}
		>
			{value}
		</span>
	)
})

export const Line = React.memo<{
	line: string[]
	lineIndex: number
	mouseIgnoreHandler: (e: React.MouseEvent<HTMLDivElement>) => void
	mouseDownHandler: (line: number, index: number) => void
	mouseUpHandler: (line: number, index: number) => void
	isCurrentLine: boolean
	selection: Selection
}>(({ line, lineIndex, mouseIgnoreHandler, mouseDownHandler, mouseUpHandler, isCurrentLine, selection }) => {
	if (!line.length) {
		line = [" "]
	}

	return (
		<div className={`flex items-center ${isCurrentLine ? "bg-gray-200 dark:bg-gray-800 dark:bg-opacity-40" : ""}`}>
			<div
				className={` w-16 shrink-0 text-sm text-right pr-2 font-sans select-none cursor-default ${
					isCurrentLine ? "text-gray-500 dark:text-gray-100" : "text-gray-400"
				}`}
				onMouseUp={mouseIgnoreHandler}
				onMouseDown={mouseIgnoreHandler}
				onMouseOver={mouseIgnoreHandler}
			>
				{lineIndex + 1}
			</div>
			<div
				data-index={`line-${lineIndex}`}
				className="w-full cursor-text px-2 text-gray-800 dark:text-gray-200"
				style={{ tabSize: "2rem" }}
				onMouseDown={(e) => {
					e.preventDefault()
					e.stopPropagation()

					mouseDownHandler(line.length - 1, lineIndex)
				}}
				onMouseUp={(e) => {
					e.preventDefault()
					e.stopPropagation()

					mouseUpHandler(line.length - 1, lineIndex)
				}}
				onMouseOver={(e) => {
					if (e.buttons === 1) {
						e.preventDefault()
						e.stopPropagation()

						mouseUpHandler(line.length - 1, lineIndex)
					}
				}}
			>
				{line.map((char, charIndex) => (
					<Char
						key={`line-${lineIndex}-${charIndex}`}
						lineIndex={lineIndex}
						charIndex={charIndex}
						value={char}
						selection={selection}
						mouseUpHandler={mouseUpHandler}
						mouseDownHandler={mouseDownHandler}
					/>
				))}
			</div>
		</div>
	)
})

const IGNORED_KEY_PRESSES = ["Meta", "Control", "Alt", "Shift", "CapsLock"]

export const TextEditor: React.FC = () => {
	const tabs = useAppSelector((state) => state.application.openFiles)
	const currentTab = useAppSelector((state) => state.application.currentFile)
	// const editorSelected = useAppSelector((state) => state.editorSelected)

	const ref = React.useRef<HTMLDivElement>(null)

	const [mouseDownPosition, setMouseDownPosition] = React.useState<SelectionBoundary | null>(null)

	React.useEffect(() => {
		if (!tabs.length || !tabs[currentTab] || !ref.current) {
			return
		}

		window.addEventListener("keydown", onKeyDown)

		const node =
			tabs[currentTab].selection.direction === "rtl"
				? document.getElementById(`line-${tabs[currentTab].selection.start.line}-${tabs[currentTab].selection.start.index}`)
				: document.getElementById(`line-${tabs[currentTab].selection.end.line}-${tabs[currentTab].selection.end.index}`)

		node && node.classList.add("caret")

		return () => {
			window.removeEventListener("keydown", onKeyDown)
			node && node.classList.remove("caret")
		}
	}, [
		tabs[currentTab].selection.start.index,
		tabs[currentTab].selection.start.line,
		tabs[currentTab].selection.end.index,
		tabs[currentTab].selection.end.line,
		tabs[currentTab].selection.direction,
	])

	const onKeyDown = (e: KeyboardEvent) => {
		// if (!editorSelected) {
		// 	return
		// }
		e.preventDefault()

		const { key, metaKey, altKey, ctrlKey, shiftKey } = e

		if (IGNORED_KEY_PRESSES.includes(key)) {
			return
		}

		window.ordo.emit("@editor/on-key-down", { key, metaKey, altKey, ctrlKey, shiftKey })
	}

	const mouseUpHandler = React.useCallback(
		(index: number, line: number) => {
			if (mouseDownPosition && (mouseDownPosition.index !== index || mouseDownPosition.line !== line)) {
				const isMouseDownBefore =
					mouseDownPosition.line < line || (mouseDownPosition.line === line && mouseDownPosition.index < index)
				const direction = isMouseDownBefore ? "ltr" : "rtl"
				window.ordo.emit(
					"@editor/on-mouse-up",
					isMouseDownBefore
						? { start: mouseDownPosition, end: { line, index }, direction }
						: { start: { line, index }, end: mouseDownPosition, direction },
				)
				return
			}
			window.ordo.emit("@editor/on-mouse-up", { start: { line, index }, end: { line, index }, direction: "ltr" })
		},
		[mouseDownPosition],
	)

	const mouseIgnoreHandler = React.useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const mouseDownHandler = React.useCallback((index: number, line: number) => {
		setMouseDownPosition({ line, index })
	}, [])

	const isCurrentLine = (index: number) =>
		tabs[currentTab].selection.direction === "rtl"
			? tabs[currentTab].selection.start.line === index
			: tabs[currentTab].selection.end.line === index

	return (
		<div>
			<div
				ref={ref}
				className="outline-none min-h-screen w-full cursor-text tracking-wide"
				onMouseDown={(e) => {
					e.preventDefault()

					mouseDownHandler(
						tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
						tabs[currentTab].body.length - 1,
					)
				}}
				onMouseUp={(e) => {
					e.preventDefault()

					mouseUpHandler(
						tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
						tabs[currentTab].body.length - 1,
					)
				}}
				onMouseOver={(e) => {
					if (e.buttons === 1) {
						e.preventDefault()

						mouseUpHandler(
							tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
							tabs[currentTab].body.length - 1,
						)
					}
				}}
			>
				{tabs[currentTab].body &&
					tabs[currentTab].body.map((line, lineIndex) => (
						<Line
							key={`line-${lineIndex}`}
							isCurrentLine={isCurrentLine(lineIndex)}
							mouseUpHandler={mouseUpHandler}
							mouseDownHandler={mouseDownHandler}
							mouseIgnoreHandler={mouseIgnoreHandler}
							selection={tabs[currentTab].selection}
							line={line}
							lineIndex={lineIndex}
						/>
					))}
			</div>
		</div>
	)
}
