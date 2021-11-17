import React from "react"

import { Conditional } from "../conditional"
import { isEmbeddableComponent, renderEmbeddable } from "./render-embeddable"
import { WelcomePage } from "./welcome-page"
import { getCaretPosition, setCaretPosition } from "./caret"
import { FileMetadata } from "../../../main/apis/fs/types"
import { Emoji } from "../emoji"
import { isEmbeddableContent, EmbeddableContent } from "./render-embeddable-content"
import { applyLineStyling } from "./apply-line-styling"

const readableSize = (a: number, b = 2, k = 1024): string => {
	const d = Math.floor(Math.log(a) / Math.log(k))
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`
}

const getDivElement = (index: number): HTMLDivElement =>
	document.querySelector(`[data-id="${index}"]`)

export const Workspace: React.FC<{
	currentFilePath: string
	metadata: FileMetadata
	toggleSaved: (path: string, saved: boolean) => void
}> = ({ currentFilePath, toggleSaved, metadata }) => {
	const [content, setContent] = React.useState<string[]>([])
	const [hash, setHash] = React.useState("")
	const [savedCaretPosition, setSavedCaretPosition] = React.useState(0)
	const [currentLine, setCurrentLine] = React.useState(0)

	React.useEffect(() => {
		const line = getDivElement(currentLine)

		if (line) {
			setCaretPosition(line, savedCaretPosition)
		}
	}, [savedCaretPosition, currentLine])

	React.useEffect(() => {
		currentFilePath &&
			window.fileSystemAPI.getFile(currentFilePath).then(({ data, hash }) => {
				setContent(data.split("\n"))
				setHash(hash)
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
				<div className="flex flex-col w-6/12 mx-auto mt-64 mb-12">
					<div className="text-5xl">{metadata.readableName}</div>
					<details>
						<summary className="text-xs text-gray-500">File Stats</summary>
						<div className="pt-4">
							<div className="flex justify-between text-sm text-gray-500 leading-7">
								<div className="w-4/12">
									{" "}
									<Emoji icon="🕛">Created</Emoji>
								</div>
								<div className="w-8/12">{metadata.createdAt.toLocaleDateString()}</div>
							</div>
							<div className="flex justify-between text-sm text-gray-500 leading-7">
								<div className="w-4/12">
									<Emoji icon="✍️">Last Updated</Emoji>
								</div>
								<div className="w-8/12">{metadata.updatedAt.toLocaleDateString()}</div>
							</div>
							<div className="flex justify-between text-sm text-gray-500 leading-7">
								<div className="w-4/12">
									<Emoji icon="👆">Last Accessed</Emoji>
								</div>
								<div className="w-8/12">{metadata.accessedAt.toLocaleDateString()}</div>
							</div>
							<div className="flex justify-between text-sm text-gray-500 leading-7">
								<div className="w-4/12">
									{" "}
									<Emoji icon="🛣">File Path</Emoji>
								</div>
								<div className="w-8/12">{metadata.path}</div>
							</div>
							<div className="flex justify-between text-sm text-gray-500 leading-7">
								<div className="w-4/12">
									{" "}
									<Emoji icon="🚛">File Size</Emoji>
								</div>
								<div className="w-8/12">{readableSize(metadata.size)}</div>
							</div>
						</div>
					</details>
				</div>
			)}
			<Conditional when={Boolean(currentFilePath)}>
				<form className="pb-80 mb-80 overflow-x-hidden">
					<div id="editor" className="pb-80 mb-80">
						{content &&
							content.map((line, index) => (
								<div key={`${line}-${index}`}>
									<div
										className={`w-full flex items-center ${index === currentLine && "bg-gray-200"}`}
									>
										<div className="text-right w-12 px-2 text-gray-700 dark:text-gray-300 font-mono">
											{index + 1}
										</div>
										<div
											style={{ maxWidth: "1000px" }}
											className="px-2 w-full border-l dark:border-gray-900 border-gray-300 "
										>
											<div
												className="w-full outline-none"
												contentEditable={true}
												data-id={index}
												onClick={() => onClickEditableDiv(index)}
												onInput={() => onChangeEditableDiv(index)}
												onKeyDown={onKeyDown}
												suppressContentEditableWarning={true}
											>
												{applyLineStyling(line)}
											</div>
										</div>
									</div>

									<Conditional when={isEmbeddableContent(line)}>
										<div className="p-2">
											<EmbeddableContent currentContent={content.join("\n")} line={line} />
										</div>
									</Conditional>

									<Conditional when={isEmbeddableComponent(line)}>
										<div className="p-2">{renderEmbeddable(line)}</div>
									</Conditional>
								</div>
							))}
					</div>
				</form>

				<WelcomePage />
			</Conditional>
		</>
	)
}
