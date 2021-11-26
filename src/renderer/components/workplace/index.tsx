import React from "react"

import { Conditional } from "../conditional"
import { WelcomePage } from "./welcome-page"
import { getCaretPosition, setCaretPosition } from "./caret"
import { MemoLine } from "./memo-line"
import { Metadata } from "./metadata"

const getDivElement = (index: number): HTMLDivElement =>
	document.querySelector(`[data-id="${index}"]`)

export const Workspace: React.FC<{
	currentFilePath: string
	toggleSaved: (path: string, saved: boolean) => void
}> = ({ currentFilePath, toggleSaved }) => {
	const [content, setContent] = React.useState<string[]>([])
	const [hash, setHash] = React.useState("")
	const [savedCaretPosition, setSavedCaretPosition] = React.useState(0)
	const [currentLine, setCurrentLine] = React.useState(0)
	const [metadata, setMetadata] = React.useState<any>(null)

	React.useEffect(() => {
		const line = getDivElement(currentLine)

		if (line) {
			setCaretPosition(line, savedCaretPosition)
		}
	}, [savedCaretPosition, currentLine])

	React.useEffect(() => {
		currentFilePath &&
			window.fileSystemAPI.getFile(currentFilePath).then((data) => {
				setContent(data.body.split("\n"))
				setHash(data.hash)
				setMetadata({
					...data,
					body: undefined,
					hash: undefined,
				})
			})
	}, [hash, currentFilePath])

	const onClickEditableDiv = (index: number) => {
		const element = getDivElement(index)
		const position = getCaretPosition(element)

		setCurrentLine(index)
		setSavedCaretPosition(position)
	}

	const onChangeEditableDiv = (index: number) => {
		toggleSaved(currentFilePath, false)

		const element = getDivElement(index)
		const position = getCaretPosition(element)

		setCurrentLine(index)
		setSavedCaretPosition(position)

		const contentCopy = [...content]
		contentCopy[index] = element.textContent
		setContent(contentCopy)
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const currentLineIndex = Number(event.currentTarget.dataset.id)
		const previousLineIndex = Number(event.currentTarget.dataset.id) - 1
		const nextLineIndex = Number(event.currentTarget.dataset.id) + 1

		const isFirstLine = currentLine === 0
		const isLastLine = currentLine === content.length - 1

		const isLineStart = savedCaretPosition === 0
		const isLineEnd = savedCaretPosition === content[currentLineIndex].length

		if (event.metaKey && event.key === "s") {
			window.fileSystemAPI.saveFile(currentFilePath, content.join("\n")).then(() => {
				toggleSaved(currentFilePath, true)
			})
		}

		if (event.key === "ArrowLeft") {
			if (!isLineStart) {
				const currentLine = getDivElement(currentLineIndex)
				setSavedCaretPosition(getCaretPosition(currentLine) - 1)
			} else if (!isFirstLine) {
				setCurrentLine(previousLineIndex)
				setSavedCaretPosition(content[previousLineIndex].length)
			}
		}

		if (event.key === "ArrowRight") {
			if (!isLineEnd) {
				const currentLine = getDivElement(currentLineIndex)
				setSavedCaretPosition(getCaretPosition(currentLine) + 1)
			} else if (!isLastLine) {
				setCurrentLine(nextLineIndex)
				setSavedCaretPosition(0)
			}
		}

		if (event.key === "ArrowUp") {
			event.preventDefault()

			if (isFirstLine) {
				return
			}

			setCurrentLine(previousLineIndex)
			setSavedCaretPosition(
				content[previousLineIndex].length < savedCaretPosition
					? content[previousLineIndex].length
					: savedCaretPosition,
			)
		}

		if (event.key === "ArrowDown") {
			event.preventDefault()

			if (isLastLine) {
				return
			}

			setCurrentLine(nextLineIndex)
			setSavedCaretPosition(
				content[nextLineIndex].length < savedCaretPosition
					? content[nextLineIndex].length
					: savedCaretPosition,
			)
		}

		if (event.key === "Backspace") {
			if (isLineStart) {
				event.preventDefault()

				const contentCopy = [...content]
				const indexBeforeMergingLines = contentCopy[previousLineIndex].length

				contentCopy[previousLineIndex] += contentCopy[currentLineIndex]
				contentCopy.splice(currentLineIndex, 1)

				setContent(contentCopy)
				setCurrentLine(previousLineIndex)
				toggleSaved(currentFilePath, false)
				setSavedCaretPosition(indexBeforeMergingLines)
			}
		}

		if (event.key === "Enter") {
			event.preventDefault()

			const contentCopy: string[] = [...content]
			const contentAfterCaret = contentCopy[currentLineIndex].slice(
				savedCaretPosition,
				contentCopy[currentLineIndex].length,
			)

			contentCopy.splice(nextLineIndex, 0, contentAfterCaret)
			contentCopy[currentLineIndex] = contentCopy[currentLineIndex].slice(0, savedCaretPosition)

			setContent(contentCopy)
			setCurrentLine(nextLineIndex)
			toggleSaved(currentFilePath, false)
			setSavedCaretPosition(0)
		}

		if (event.metaKey && event.key === "a") {
			event.preventDefault()
			// TODO
		}

		if (event.key === "Tab") {
			event.preventDefault()
			const contentCopy = [...content]

			if (!event.shiftKey) {
				contentCopy[currentLineIndex] = `	${contentCopy[currentLineIndex]}`
				setSavedCaretPosition(savedCaretPosition + 1)
			} else if (content[currentLineIndex].startsWith("	")) {
				contentCopy[currentLineIndex] = contentCopy[currentLineIndex].slice(1)
				setSavedCaretPosition(savedCaretPosition - 1)
			}

			toggleSaved(currentFilePath, false)
			setContent(contentCopy)
		}
	}

	return (
		<>
			{Boolean(currentFilePath) && metadata && metadata.readableName && (
				<Metadata metadata={metadata} />
			)}
			<Conditional when={Boolean(currentFilePath)}>
				<form className="pb-80 mb-80 overflow-x-hidden">
					<div id="editor" className="pb-80 mb-80 font-mono">
						{content &&
							content.map((line, index) => (
								<MemoLine
									key={`${line}-${index}`}
									onClick={onClickEditableDiv}
									onChange={onChangeEditableDiv}
									onKeyDown={onKeyDown}
									line={line}
									index={index}
									currentLine={currentLine}
									content={content}
								/>
							))}
					</div>
				</form>

				<WelcomePage />
			</Conditional>
		</>
	)
}
