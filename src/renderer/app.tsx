import React from "react"
import { findFileByName, findFileByPath } from "../utils/tree"
import { FileMetadata, Folder } from "../main/apis/fs/types"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"

export const App: React.FC = () => {
	const [rootPath, setRootPath] = React.useState("")
	const [fileTree, setFileTree] = React.useState(null as Folder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [currentFileMetadata, setCurrentFileMetadata] = React.useState({} as FileMetadata)

	const updateFileTreeListener = () => {
		window.fileSystemAPI.listFolder(rootPath).then((data) => {
			setFileTree(data)
			setHash(data.hash)
			window.settingsAPI.get("application.last-open-file").then(setCurrentFilePath)
		})
	}

	React.useEffect(() => {
		if (currentFilePath) {
			const node = findFileByPath(fileTree, currentFilePath)
			setCurrentFileMetadata(node)
		}
	}, [currentFilePath, fileTree, hash])

	const setCurrentFileListener = ({ detail }: CustomEvent) => {
		if (detail.path.startsWith("https://") || detail.path.startsWith("http://")) {
			window.shellAPI.openExternal(detail.path)
		} else if (!detail.path.startsWith("/")) {
			let node: Folder | FileMetadata = fileTree

			if (~detail.path.indexOf("/")) {
				const chunks = detail.path.split("/")

				for (const chunk of chunks) {
					node = node.isFolder ? node.children.find((child) => child.readableName === chunk) : node

					if (node.isFile && chunks.indexOf(chunk) === chunks.length - 1) {
						setCurrentFileMetadata(node)
						setCurrentFilePath(node.path)
					}
				}
			} else {
				node = findFileByName(fileTree, detail.path)
				setCurrentFileMetadata(node)
				setCurrentFilePath(node.path)
			}
		} else {
			const node = findFileByPath(fileTree, detail.path)
			setCurrentFileMetadata(node)
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
			.then(() => assignCurrentPath(path))
			.then(updateFileTreeListener)

	const createFolder = (path: string) =>
		window.fileSystemAPI.createFolder(path).then(updateFileTreeListener)

	const rename = (oldPath: string, newPath: string) =>
		window.fileSystemAPI
			.move(oldPath, newPath)
			.then(() => assignCurrentPath(newPath))
			.then(updateFileTreeListener)

	const deleteFile = (path: string) =>
		window.fileSystemAPI
			.deleteFile(path)
			.then(() => {
				if (currentFilePath === path) {
					assignCurrentPath("")
				}
			})
			.then(updateFileTreeListener)

	const deleteFolder = (path: string) =>
		window.fileSystemAPI.deleteFolder(path).then(updateFileTreeListener)

	const assignCurrentPath = (path: string) => {
		window.settingsAPI.set("application.last-open-file", path)
		setCurrentFilePath(path)
	}

	React.useEffect(() => {
		window.settingsAPI.get("application.root-folder-path").then((path) => {
			if (!path) {
				window.fileSystemAPI.selectRootFolder().then((path) => {
					setCurrentFilePath("")
					setRootPath(path)
				})
			} else {
				setRootPath(path)
				updateFileTreeListener()
			}
		})
	}, [rootPath])

	const selectRootDir = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.preventDefault()

		window.fileSystemAPI.selectRootFolder().then((path) => {
			setCurrentFilePath("")
			setRootPath(path)
		})
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-grow w-full">
				<div className="h-screen overflow-y-auto flex flex-col justify-between w-2/12 border-r border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<div>
						<h2 className="uppercase text-sm text-center text-gray-600 dark:text-gray-500">
							Explorer
						</h2>
						<FileExplorer
							unsavedFiles={unsavedFiles}
							currentFile={currentFilePath}
							setCurrentFile={assignCurrentPath}
							createFile={createFile}
							deleteFile={deleteFile}
							createFolder={createFolder}
							deleteFolder={deleteFolder}
							rename={rename}
							tree={fileTree}
							root={rootPath}
						/>
					</div>

					<div className="px-2">
						<button
							onClick={selectRootDir}
							className="w-full text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500"
						>
							⤴ Open Workspace
						</button>
					</div>
				</div>
				<div className="h-screen overflow-y-auto w-10/12 bg-gray-100">
					<Workspace
						currentFilePath={currentFilePath}
						metadata={currentFileMetadata}
						toggleSaved={toggleUnsavedFileStatus}
					/>
				</div>
			</div>
		</div>
	)
}
