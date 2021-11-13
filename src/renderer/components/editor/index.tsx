import * as React from "react"
import { Conditional } from "../conditional"
import { WelcomePage } from "./welcome-page"

export const Editor: React.FC<{
	currentFilePath: string
	setRenderContent: React.Dispatch<React.SetStateAction<string>>
	toggleSaved: (path: string, saved: boolean) => void
}> = ({ setRenderContent, currentFilePath, toggleSaved }) => {
	const [content, setContent] = React.useState("")
	const [hash, setHash] = React.useState("")

	const onInput = (event: React.FormEvent<HTMLDivElement>) => {
		toggleSaved(currentFilePath, false)

		setRenderContent(event.currentTarget.innerText)
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.metaKey && event.key === "s") {
			window.fileSystemAPI.saveFile(currentFilePath, event.currentTarget.innerText).then(() => {
				toggleSaved(currentFilePath, true)
			})
		}
	}

	React.useEffect(() => {
		currentFilePath &&
			window.fileSystemAPI.getFile(currentFilePath).then(({ data, hash }) => {
				setContent(data)
				setHash(hash)
				setRenderContent(data)
			})
	}, [hash, currentFilePath, currentFilePath])

	return (
		<Conditional when={Boolean(currentFilePath)}>
			<div
				contentEditable="true"
				suppressContentEditableWarning={true}
				className="h-full w-full font-mono outline-none whitespace-pre-line leading-7"
				onKeyDown={onKeyDown}
				onInput={onInput}
			>
				{content}
			</div>
			<WelcomePage />
		</Conditional>
	)
}
