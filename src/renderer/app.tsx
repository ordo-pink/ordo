import * as React from "react"
import { findPathByName } from "../utils/tree"
import { FileMetadata, Folder } from "../main/apis/fs/types"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"

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

const BlockHeading: React.FC<{ text: string }> = ({ text }) => (
	<h2 className="w-full uppercase text-sm text-center text-gray-600 dark:text-gray-500">{text}</h2>
)

const ExtensionWindow: React.FC<{ width: keyof typeof ExtensionWidth }> = ({ children, width }) => (
	<div className={`${ExtensionWidth[width]} overflow-auto bg-gray-100 dark:bg-gray-700 h-full p-4`}>
		{children}
	</div>
)

export const App: React.FC = () => {
	const [rootPath, setRootPath] = React.useState("")
	const [fileTree, setFileTree] = React.useState<Folder>({} as Folder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState([])

	const updateFileTreeListener = () => {
		window.fileSystemAPI.listFolder(rootPath).then((data) => {
			setFileTree(data)
			setHash(data.hash)

			window.settingsAPI.get("application.last-open-file").then((value) => {
				if (value) {
					setCurrentFilePath(value)
				}
			})
		})
	}

	const setCurrentFileListener = ({ detail }: CustomEvent) => {
		if (detail.path.startsWith("https://") || detail.path.startsWith("http://")) {
			window.shellAPI.openExternal(detail.path)
		} else if (!detail.path.startsWith("/")) {
			const chunks = detail.path.split("/")

			let node: Folder = fileTree
			let i = 0
			let l = chunks.length - 1

			while (l >= 0) {
				node = node.children.find((child) => child.readableName === chunks[i]) as any
				if (node.isFile && !l) {
					setCurrentFilePath(node.path)
				}

				l--
				i++
			}
		} else {
			setCurrentFilePath(detail.path)
		}
	}

	React.useEffect(() => {
		window.addEventListener("set-current-file", setCurrentFileListener)
		window.addEventListener("update-tree", updateFileTreeListener)

		return () => {
			window.removeEventListener("set-current-file", setCurrentFileListener)
			window.removeEventListener("update-tree", updateFileTreeListener)
		}
	}, [hash])

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
		window.settingsAPI.get("application.root-folder-path").then((path) => {
			setRootPath(path)

			window.fileSystemAPI.listFolder(path).then((data) => {
				setFileTree(data)
				setHash(data.hash)

				window.settingsAPI.get("application.last-open-file").then((value) => {
					if (value) {
						setCurrentFilePath(value)
					}
				})
			})
		})
	}, [hash, rootPath])

	const selectRootDir = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.preventDefault()

		window.fileSystemAPI.selectRootFolder().then((path) => {
			setCurrentFilePath("")
			setRootPath(path)
		})
	}

	return (
		<div className="w-full flex flex-col h-screen">
			<div className="flex flex-grow w-full h-screen">
				<div className="flex flex-col justify-between w-2/12 border-r border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<div>
						<BlockHeading text="Explorer" />
						<FileExplorer
							unsavedFiles={unsavedFiles}
							tree={fileTree}
							root={rootPath}
							currentFile={currentFilePath}
							setCurrentFile={assignCurrentPath}
						/>
					</div>

					<div className="px-2">
						<button
							onClick={selectRootDir}
							className={`w-full text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500`}
						>
							⤴ Open Workspace
						</button>
					</div>
				</div>
				<ExtensionWindow width="12/12">
					<Workspace currentFilePath={currentFilePath} toggleSaved={toggleUnsavedFileStatus} />
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
