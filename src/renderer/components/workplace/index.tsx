import React from "react"
import { Conditional } from "../conditional"
import { isEmbeddableComponent, renderEmbeddable } from "./render-embeddable"
import { WelcomePage } from "./welcome-page"
import { getCaretPosition, setCaretPosition } from "./caret"

const applyStyles = (line: string) => {
	line = line
		.replace(/\*\*([^**]+)\*\*/g, (value) => `<strong>${value}</strong>`)
		.replace(/_([^_]+)_/g, (value) => `<em>${value}</em>`)
		.replace(/~~([^~~]+)~~/g, (value) => `<strike>${value}</strike>`)
		.replace(
			/`([^`]+)`/g,
			(value) => `<code class="bg-pink-200 p-1 rounded-lg shadow-sm">${value}</code>`,
		)
		.replace(
			/\[\[(.*)\]\]/g,
			(value) =>
				`<span class="text-blue-600 underline cursor-pointer" onclick="window.dispatchEvent(new CustomEvent('set-current-file', { detail: { path: '${value
					.replace("[[", "")
					.replace("]]", "")}' }}))">${value}</span>`,
		)

	let transformed

	if (line.startsWith("# ")) {
		transformed = <h1 className="text-4xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("## ")) {
		transformed = <h2 className="text-3xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("### ")) {
		transformed = <h3 className="text-2xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("#### ")) {
		transformed = <h4 className="text-xl" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("##### ")) {
		transformed = <h5 className="text-lg" dangerouslySetInnerHTML={{ __html: line }} />
	} else if (line.startsWith("> ")) {
		transformed = (
			<blockquote
				className="border-l-2 border-gray-600 pl-2"
				dangerouslySetInnerHTML={{ __html: line }}
			/>
		)
	} else {
		transformed = <span dangerouslySetInnerHTML={{ __html: line }} />
	}

	if (isEmbeddableComponent(line)) {
		return <span className="text-sm font-mono text-gray-500">{line}</span>
	}

	return <span className="whitespace-pre-wrap leading-7">{transformed}</span>
}

// const getLineElement = (index: number): HTMLInputElement =>
// 	document.getElementById(`line-${index}`) as HTMLInputElement

const getDivElement = (index: number): HTMLDivElement =>
	document.querySelector(`[data-id="${index}"]`)

export const Workspace: React.FC<{
	currentFilePath: string
	toggleSaved: (path: string, saved: boolean) => void
	setFocused: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ currentFilePath, toggleSaved, setFocused }) => {
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
		setFocused(true)
		setSavedCaretPosition(position)
	}

	const onChangeEditableDiv = (index: number) => {
		toggleSaved(currentFilePath, false)

		const element = getDivElement(index)
		const position = getCaretPosition(element)

		setCurrentLine(index)
		setFocused(true)
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
		<Conditional when={Boolean(currentFilePath)}>
			<form className="pb-80 mb-80">
				<div id="editor" className="pb-80 mb-80">
					{content &&
						content.map((line, index) => (
							<div
								className={`flex items-center ${index === currentLine && "bg-gray-200"}`}
								key={`${line}-${index}`}
							>
								<div className="text-right w-12 px-2 text-gray-700 dark:text-gray-300 font-mono">
									{index + 1}
								</div>
								<div className="px-2 w-full border-l dark:border-gray-900 border-gray-300 ">
									<div
										className="outline-none"
										contentEditable={true}
										data-id={index}
										onClick={() => onClickEditableDiv(index)}
										onInput={() => onChangeEditableDiv(index)}
										onKeyDown={onKeyDown}
										onBlur={() => setFocused(false)}
										suppressContentEditableWarning={true}
									>
										{applyStyles(line)}
									</div>

									<Conditional when={isEmbeddableComponent(line)}>
										{renderEmbeddable(line)}
									</Conditional>
								</div>
							</div>
						))}
				</div>
			</form>

			<WelcomePage />
		</Conditional>
	)
}
