import React from "react"
import { Folder } from "../main/apis/fs/types"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"

export const App: React.FC = () => {
	const [rootPath, setRootPath] = React.useState("")
	const [fileTree, setFileTree] = React.useState<Folder>({} as Folder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [workspaceFocused, setWorkspaceFocused] = React.useState(false)

	const globalKeyUpListener = (e: KeyboardEvent) => {
		if (workspaceFocused) {
			return
		}

		if (currentFilePath && e.key === "Backspace" && e.metaKey) {
			window.fileSystemAPI.deleteFile(currentFilePath).then(() => {
				setCurrentFilePath("")
				updateFileTreeListener()
			})
		}

		if (currentFilePath && e.key === "Enter") {
			console.log("here")
		}
	}

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
				node = node.children.find((child) => child.readableName === chunks[i]) as Folder

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
		window.addEventListener("keydown", globalKeyUpListener)

		return () => {
			window.removeEventListener("set-current-file", setCurrentFileListener)
			window.removeEventListener("update-tree", updateFileTreeListener)
			window.removeEventListener("keydown", globalKeyUpListener)
		}
	}, [hash, currentFilePath])

	const toggleUnsavedFileStatus = (path: string, saved: boolean) => {
		const unsavedFilesCopy = [...unsavedFiles]

		if (saved) {
			unsavedFilesCopy.splice(unsavedFilesCopy.indexOf(path), 1)
		} else if (!unsavedFilesCopy.includes(path)) {
			unsavedFilesCopy.push(path)
		}

		setUnsavedFiles(unsavedFilesCopy)
	}

	const createFile = (path: string) =>
		window.fileSystemAPI
			.createFile(path)
			.then(() => setCurrentFilePath(path))
			.then(updateFileTreeListener)

	const createFolder = (path: string) =>
		window.fileSystemAPI.createFolder(path).then(updateFileTreeListener)

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
		<div className="w-full flex flex-col">
			<div className="flex flex-grow w-full">
				<div className="h-screen overflow-y-auto flex flex-col justify-between w-2/12 border-r border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<div className="">
						<h2 className="w-full uppercase text-sm text-center text-gray-600 dark:text-gray-500">
							Explorer
						</h2>
						<FileExplorer
							unsavedFiles={unsavedFiles}
							createFile={createFile}
							createFolder={createFolder}
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
				<div className="h-screen overflow-y-auto w-10/12 bg-gray-100">
					<Workspace
						currentFilePath={currentFilePath}
						toggleSaved={toggleUnsavedFileStatus}
						setFocused={setWorkspaceFocused}
					/>
				</div>
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
