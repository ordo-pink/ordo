import React from "react"
import { Conditional } from "../conditional"
import { Kanban } from "../embeddable/kanban"

export const WelcomePage: React.FC = () => (
	<div className="flex flex-grow align-middle items-center justify-center h-full">
		<p className="text-gray-900 dark:text-gray-100 text-2xl text-center w-64">Welcome to ||DO!</p>
	</div>
)

const components = {
	Kanban,
}

const renderEmbeddable = (line: string) => {
	try {
		const attributes = line.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

		const componentName = line.match(/<([^\s>]+)(\s|>)+/)[1]
		const Component = (components as any)[componentName]

		const props = (attributes || []).reduce((acc, v) => {
			const pair = v.split("=")
			acc[pair[0]] = pair[1].slice(1, -1)
			return acc
		}, {} as Record<string, string>)

		return <Component {...props} />
	} catch (e) {
		return (
			<div
				className=""
				dangerouslySetInnerHTML={{
					__html: `<p class="text-red-700">Error loading component: ${e.message}</p>`,
				}}
			/>
		)
	}
}

const getClassName = (line: string) =>
	"bg-transparent w-full outline-none leading-7 ".concat(
		line.startsWith("# ") ? "text-4xl " : "",
		line.startsWith("## ") ? "text-3xl " : "",
		line.startsWith("### ") ? "text-2xl " : "",
		line.startsWith("#### ") ? "text-xl " : "",
		line.startsWith("##### ") ? "text-lg " : "",
		line.startsWith("> ") ? "border-l-2 border-gray-600 pl-2 " : "",
		isEmbeddableComponent(line) ? "text-sm font-mono text-gray-500 " : "",
	)

const isEmbeddableComponent = (line: string) =>
	/^<[A-Z][a-zA-Zа-яА-Я";/=\-[\]{}.,'/ ]+\/>/.test(line)

const getLineElement = (index: number): HTMLInputElement =>
	document.getElementById(`line-${index}`) as HTMLInputElement

export const Workspace: React.FC<{
	currentFilePath: string
	toggleSaved: (path: string, saved: boolean) => void
}> = ({ currentFilePath, toggleSaved }) => {
	const [content, setContent] = React.useState([])
	const [hash, setHash] = React.useState("")
	const [lastCaretPosition, setLastCaretPosition] = React.useState<[number, number]>([0, 0])
	const [currentLine, setCurrentLine] = React.useState(0)

	const onClick = (event: React.MouseEvent<HTMLInputElement>) => {
		const focusedLineIndex = Number(event.currentTarget.dataset.id)

		const focusedLine: HTMLInputElement = document.getElementById(
			`line-${focusedLineIndex}`,
		) as HTMLInputElement

		setCurrentLine(focusedLineIndex)
		setLastCaretPosition([focusedLine.selectionStart, focusedLine.selectionEnd])
	}

	const onChange = (event: React.FormEvent<HTMLInputElement>, index: number) => {
		toggleSaved(currentFilePath, false)

		setLastCaretPosition([event.currentTarget.selectionStart, event.currentTarget.selectionEnd])
		setCurrentLine(Number(event.currentTarget.dataset.id))

		const contentCopy = [...content]
		contentCopy[index] = event.currentTarget.value
		setContent(contentCopy)
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const [selectionStart, selectionEnd] = lastCaretPosition

		const currentLineIndex = Number(event.currentTarget.dataset.id)
		const previousLineIndex = Number(event.currentTarget.dataset.id) - 1
		const nextLineIndex = Number(event.currentTarget.dataset.id) + 1

		const isFirstLine = currentLine === 0
		const isLastLine = currentLine === content.length - 1

		const isLineStart = selectionStart === 0
		const isLineEnd = selectionStart === content[currentLineIndex].length

		if (event.metaKey && event.key === "s") {
			window.fileSystemAPI.saveFile(currentFilePath, content.join("\n")).then(() => {
				toggleSaved(currentFilePath, true)
			})
		}

		if (event.key === "ArrowLeft") {
			event.preventDefault()

			if (!isLineStart) {
				const oneCharLeftIndex = event.currentTarget.selectionStart - 1
				const currentLine = getLineElement(currentLineIndex)

				currentLine.setSelectionRange(oneCharLeftIndex, oneCharLeftIndex)

				setLastCaretPosition([oneCharLeftIndex, oneCharLeftIndex])
				return
			}

			if (isFirstLine) {
				return
			}

			const previousLine: HTMLInputElement = document.getElementById(
				`line-${previousLineIndex}`,
			) as HTMLInputElement

			previousLine.focus()
			previousLine.setSelectionRange(
				content[previousLineIndex].length,
				content[previousLineIndex].length,
			)

			setLastCaretPosition([content[previousLineIndex].length, content[previousLineIndex].length])
			setCurrentLine(previousLineIndex)
		}

		if (event.key === "ArrowRight") {
			event.preventDefault()

			if (!isLineEnd) {
				const oneCharRightIndex = event.currentTarget.selectionEnd + 1
				const currentLine = getLineElement(currentLineIndex)

				currentLine.setSelectionRange(oneCharRightIndex, oneCharRightIndex)

				setLastCaretPosition([oneCharRightIndex, oneCharRightIndex])
				return
			}

			if (isLastLine) {
				return
			}

			const nextLine: HTMLInputElement = getLineElement(nextLineIndex)

			nextLine.focus()
			nextLine.setSelectionRange(0, 0)

			setLastCaretPosition([0, 0])
			setCurrentLine(nextLineIndex)
		}

		if (event.key === "ArrowUp") {
			event.preventDefault()

			if (isFirstLine) {
				return
			}

			const previousLine = getLineElement(previousLineIndex)

			previousLine.focus()
			previousLine.setSelectionRange(selectionEnd, selectionEnd)

			setCurrentLine(previousLineIndex)
		}

		if (event.key === "ArrowDown") {
			event.preventDefault()

			if (isLastLine) {
				return
			}

			const nextLine = getLineElement(nextLineIndex)

			nextLine.focus()
			nextLine.setSelectionRange(selectionEnd, selectionEnd)

			setCurrentLine(nextLineIndex)
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
				setLastCaretPosition([indexBeforeMergingLines, indexBeforeMergingLines])
			}
		}

		if (event.key === "Enter") {
			event.preventDefault()

			const contentCopy: string[] = [...content]
			const postCaretContent = contentCopy[currentLineIndex].slice(
				selectionEnd,
				contentCopy[currentLineIndex].length,
			)

			contentCopy.splice(nextLineIndex, 0, postCaretContent)
			contentCopy[currentLineIndex] = contentCopy[currentLineIndex].slice(0, selectionEnd)

			setContent(contentCopy)
			setCurrentLine(nextLineIndex)
			toggleSaved(currentFilePath, false)
			setLastCaretPosition([0, 0])
		}

		if (event.metaKey && event.key === "a") {
			// event.preventDefault()
			// const editor = document.getElementById("editor") as HTMLDivElement
			// const range = new Range()
			// range.setStart(editor, 0)
			// range.setEnd(editor, content.join("\n").length)
			// document.getSelection().removeAllRanges()
			// document.getSelection().addRange(range)
		}

		if (event.key === "Tab") {
			event.preventDefault()

			const contentCopy = [...content]

			contentCopy[currentLineIndex] = `	${contentCopy[currentLineIndex]}`

			setLastCaretPosition([selectionStart + 1, selectionEnd + 1])
			toggleSaved(currentFilePath, false)
			setContent(contentCopy)
		}

		if (event.key === "Tab" && event.shiftKey) {
			event.preventDefault()

			if (content[currentLineIndex].startsWith("	")) {
				const contentCopy = [...content]

				contentCopy[currentLineIndex] = contentCopy[currentLineIndex].slice(1)

				setLastCaretPosition([selectionStart - 1, selectionEnd - 1])
				toggleSaved(currentFilePath, false)
				setContent(contentCopy)
			}
		}
	}

	React.useEffect(() => {
		const line = getLineElement(currentLine)

		if (line) {
			line.focus()
			line.setSelectionRange(...lastCaretPosition)
		}
	})

	React.useEffect(() => {
		currentFilePath &&
			window.fileSystemAPI.getFile(currentFilePath).then(({ data, hash }) => {
				setContent(data.split("\n"))
				setHash(hash)
			})
	}, [hash, currentFilePath])

	return (
		<Conditional when={Boolean(currentFilePath)}>
			<form className="pb-80 mb-80">
				<div id="editor" className="pb-80 mb-80">
					{content &&
						content.map((line, index) => (
							<div
								className={`flex items-baseline ${index === currentLine && "bg-gray-200"}`}
								key={`${line}-${index}`}
							>
								<div className="text-right w-12 px-2 leading-7 text-gray-700 dark:text-gray-300 font-thin">
									{index + 1}
								</div>
								<div className="pl-2 w-full border-l dark:border-gray-900 border-gray-300 ">
									<input
										id={`line-${index}`}
										data-id={index}
										onClick={onClick}
										className={getClassName(line)}
										onChange={(e) => onChange(e, index)}
										onKeyDown={onKeyDown}
										value={line}
									/>
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
