import React from "react"

import { Conditional } from "../conditional"
import { WelcomePage } from "./welcome-page"
import { getCaretPosition, setCaretPosition } from "./caret"
import { MemoLine } from "./memo-line"
import { Metadata } from "./metadata"
import { useAppSelector } from "../../../renderer/app/hooks"
import { MDFile } from "../../../global-context/types"
import { HiChevronRight } from "react-icons/hi"

const getDivElement = (index: number): HTMLDivElement =>
	document.querySelector(`[data-id="${index}"]`)

const IMAGE_FILE_EXTENSIONS = [
	".apng",
	".avif",
	".gif",
	".jpg",
	".jpeg",
	".pjpeg",
	".pjp",
	".png",
	".svg",
	".webp",
	".bmp",
	".ico",
	".cur",
	".tif",
	".tiff",
]

export const Workspace: React.FC<{
	toggleSaved: (path: string, saved: boolean) => void
}> = ({ toggleSaved }) => {
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	const [content, setContent] = React.useState<string[]>([])
	const [savedCaretPosition, setSavedCaretPosition] = React.useState(0)
	const [currentLine, setCurrentLine] = React.useState(0)
	const [metadata, setMetadata] = React.useState<MDFile>(null)
	const [isImage, setIsImage] = React.useState(false)
	const [extension, setExtension] = React.useState("")
	const [imageContent, setImageContent] = React.useState("")
	const [breadcrumbs, setBreadcrumbs] = React.useState(null)

	React.useEffect(() => {
		const line = getDivElement(currentLine)

		if (line) {
			setCaretPosition(line, savedCaretPosition)
		}
	}, [savedCaretPosition, currentLine])

	React.useEffect(() => {
		currentPath &&
			window.fileSystemAPI.getFile(currentPath).then((data) => {
				setBreadcrumbs(data.path.split("/"))

				if (data.extension === ".md") {
					setIsImage(false)
					setContent(data.body.split("\n"))
					setMetadata({
						...data,
						body: undefined,
					})
				} else if (IMAGE_FILE_EXTENSIONS.includes(data.extension)) {
					setIsImage(true)
					setExtension(data.extension)
					setImageContent(data.body)
				}
			})
	}, [currentPath])

	const onClickEditableDiv = (index: number) => {
		const element = getDivElement(index)
		const position = getCaretPosition(element)

		setCurrentLine(index)
		setSavedCaretPosition(position)
	}

	const onChangeEditableDiv = (index: number) => {
		toggleSaved(currentPath, false)

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
			window.fileSystemAPI.saveFile(currentPath, content.join("\n")).then(() => {
				toggleSaved(currentPath, true)
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
				toggleSaved(currentPath, false)
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
			toggleSaved(currentPath, false)
			setSavedCaretPosition(0)
		}

		if (event.metaKey && event.key === "a") {
			event.preventDefault()
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

			toggleSaved(currentPath, false)
			setContent(contentCopy)
		}
	}

	return (
		<>
			<div className="py-2 text-gray-600 text-xs cursor-default flex">
				{breadcrumbs &&
					breadcrumbs.map((breadcrumb: string, index: number) => (
						<span className="flex items-center">
							<span className="px-1 hover:text-blue-600 cursor-pointer">{breadcrumb}</span>
							{index !== breadcrumbs.length - 1 && index !== 0 && <HiChevronRight />}
						</span>
					))}
			</div>
			<Conditional when={isImage}>
				<div className="h-screen w-full flex justify-between items-center">
					{imageContent && (
						<img
							className="mx-auto w-9/12 shadow-2xl"
							src={`data:image/${extension.slice(1)};base64,${imageContent}`}
						/>
					)}
				</div>
				<div>
					{Boolean(currentPath) && metadata && metadata.readableName && (
						<Metadata metadata={metadata} />
					)}
					<Conditional when={Boolean(currentPath)}>
						<div className="pb-80 mb-80 overflow-x-hidden">
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
						</div>

						<WelcomePage />
					</Conditional>
				</div>
			</Conditional>
		</>
	)
}
