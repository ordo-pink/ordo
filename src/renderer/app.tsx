import * as React from "react"
import { Folder } from "../main/apis/fs/types"
import { Editor } from "./components/editor"
import { FileExplorer } from "./components/file-explorer"
import { RenderWindow } from "./components/render-window"
import { useEventListener } from "./hooks/use-event-listener"

const listFolder = window.fileSystemAPI.listFolder

const ExtensionWidth = {
	"1/12": "w-1/12",
	"2/12": "w-2/12",
	"3/12": "w-3/12",
	"4/12": "w-4/12",
	"5/12": "w-5/12",
	"6/12": "w-6/12",
	"7/12": "w-7/12",
	"8/12": "w-8/12",
	"9/12": "w-9/12",
	"10/12": "w-10/12",
	"11/12": "w-11/12",
	"12/12": "w-full",
}

const path = "mock-data"

const BlockHeading: React.FC<{ text: string }> = ({ text }) => (
	<h2 className="w-full uppercase text-sm text-center text-gray-600 dark:text-gray-500">{text}</h2>
)

const ExtensionWindow: React.FC<{ width: keyof typeof ExtensionWidth }> = ({ children, width }) => (
	<div className={`${ExtensionWidth[width]} overflow-auto bg-gray-100 dark:bg-gray-700 h-full p-4`}>
		{children}
	</div>
)

export const App: React.FC = () => {
	const [fileTree, setFileTree] = React.useState<Folder>({} as Folder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [renderContent, setRenderContent] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState([])

	useEventListener("update-tree" as any, () => {
		listFolder(path).then((data) => {
			setFileTree(data)
			setHash(data.hash)

			window.settingsAPI.get("application.last-open-file").then((value) => {
				if (value) {
					setCurrentFilePath(value)
				}
			})
		})
	})

	// useEventListener("keydown", ({ key, metaKey }) => {

	// })

	const toggleUnsavedFileStatus = (path: string, saved: boolean) => {
		const unsavedFilesCopy = [...unsavedFiles]

		if (saved) {
			unsavedFilesCopy.splice(unsavedFilesCopy.indexOf(path), 1)
		} else if (!unsavedFilesCopy.includes(path)) {
			unsavedFilesCopy.push(path)
		}

		setUnsavedFiles(unsavedFilesCopy)
	}

	const assignCurrentPath = (path: string) => {
		window.settingsAPI.set("application.last-open-file", path)
		setCurrentFilePath(path)
	}

	React.useEffect(() => {
		listFolder(path).then((data) => {
			setFileTree(data)
			setHash(data.hash)

			window.settingsAPI.get("application.last-open-file").then((value) => {
				if (value) {
					setCurrentFilePath(value)
				}
			})
		})
	}, [hash])

	return (
		<div className="w-full flex flex-col h-screen">
			<div className="flex flex-grow w-full h-screen">
				<div className="w-2/12 border-r border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<BlockHeading text="Explorer" />
					<FileExplorer
						unsavedFiles={unsavedFiles}
						tree={fileTree}
						root={path}
						currentFile={currentFilePath}
						setCurrentFile={assignCurrentPath}
					/>
				</div>
				<ExtensionWindow width="2/12">
					<Editor
						setRenderContent={setRenderContent}
						currentFilePath={currentFilePath}
						toggleSaved={toggleUnsavedFileStatus}
					/>
				</ExtensionWindow>
				<ExtensionWindow width="8/12">
					<RenderWindow content={renderContent} />
				</ExtensionWindow>
				{/* <div className="flex flex-col ml-4 w-2/12 h-full space-y-4">
					<div className="p-2 h-1/3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
						<BlockHeading text="Recent Files" />
					</div>
					<div className="p-2 h-1/3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
						<BlockHeading text="Favourite Files" />
					</div>
					<div className="p-2 h-1/3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
						<BlockHeading text="Tags" />
					</div>
				</div> */}
			</div>
		</div>
	)
}
