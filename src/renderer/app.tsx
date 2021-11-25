import type { ArbitraryFolder, MDFile } from "../global-context/types"
import type { Hashed } from "../main/apis/hash-response"

import React from "react"
import { hierarchy as createHierarchy, HierarchyNode } from "d3"

import { findFileByName, findFileByPath } from "../utils/tree"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"
import { isFolder } from "../global-context/init"
import { Conditional } from "./components/conditional"
import { FileTreeGraph } from "./components/charts/file-tree"

export const App: React.FC = () => {
	const [rootPath, setRootPath] = React.useState("")
	const [fileTree, setFileTree] = React.useState(null as ArbitraryFolder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [currentFileMetadata, setCurrentFileMetadata] = React.useState({} as MDFile)
	const [currentView, setCurrentView] = React.useState<"workspace" | "graph" | "settings">(
		"workspace",
	)
	const [hierarchy, setHierarchy] = React.useState<HierarchyNode<Hashed<ArbitraryFolder>>>(null)

	const updateFileTreeListener = () => {
		window.fileSystemAPI.listFolder(rootPath).then((data) => {
			setFileTree(data)
			setHierarchy(createHierarchy(data))
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
			let node: ArbitraryFolder | MDFile = { ...fileTree }

			if (~detail.path.indexOf("/")) {
				const chunks = detail.path.split("/")

				for (const chunk of chunks) {
					node = isFolder(node)
						? (node.children.find((child) => child.readableName === chunk) as MDFile)
						: node

					if (node.isFile && chunks.indexOf(chunk) === chunks.length - 1) {
						setCurrentFileMetadata(node)
						setCurrentFilePath(node.path)
						setCurrentView("workspace")
					}
				}
			} else {
				node = findFileByName(fileTree, detail.path)

				if (node.isFile) {
					setCurrentFileMetadata(node)
					setCurrentFilePath(node.path)
					setCurrentView("workspace")
				}
			}
		} else {
			const node = findFileByPath(fileTree, detail.path)
			setCurrentFileMetadata(node)
			setCurrentFilePath(detail.path)
			setCurrentView("workspace")
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

	const createFile = (folder: ArbitraryFolder, name: string) =>
		window.fileSystemAPI
			.createFile(folder, `${name}.md`)
			.then(updateFileTreeListener)
			.then(() => assignCurrentPath(`${folder.path}/${name}.md`))

	const createFolder = (folder: ArbitraryFolder, name: string) =>
		window.fileSystemAPI.createFolder(folder, name).then(updateFileTreeListener)

	const rename = (oldPath: string, newPath: string) =>
		window.fileSystemAPI
			.move(oldPath, newPath)
			.then(() => assignCurrentPath(newPath))
			.then(updateFileTreeListener)

	const deleteItem = (path: string) =>
		window.fileSystemAPI
			.delete(path)
			.then(() => {
				if (currentFilePath === path) {
					assignCurrentPath("")
				}
			})
			.then(updateFileTreeListener)

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
		<div className="flex">
			<div className="flex flex-grow w-full overflow-y-hidden overflow-x-hidden">
				<Conditional when={currentView === "graph" && Boolean(hierarchy)}>
					<div className="flex flex-col w-full flex-grow">
						<FileTreeGraph hierarchy={hierarchy} />
					</div>
					<div className="flex flex-col w-full flex-grow overflow-y-auto overflow-x-auto">
						<Workspace
							currentFilePath={currentFilePath}
							metadata={currentFileMetadata}
							toggleSaved={toggleUnsavedFileStatus}
						/>
					</div>
				</Conditional>
			</div>

			<Conditional when={currentView === "workspace"}>
				<div className="fixed right-16 top-0 h-screen overflow-y-auto flex flex-col justify-between w-72 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<div>
						<h2 className="uppercase text-sm text-center text-gray-600 dark:text-gray-500">
							Explorer
						</h2>
						<FileExplorer
							unsavedFiles={unsavedFiles}
							currentFile={currentFilePath}
							setCurrentFile={assignCurrentPath}
							createFile={createFile}
							deleteItem={deleteItem}
							createFolder={createFolder}
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
			</Conditional>

			<div className="fixed right-0 w-16 top-0 h-screen overflow-y-visible overflow-x-hidden items-center flex flex-col p-4 space-y-4 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
				<button className="text-4xl" onClick={() => setCurrentView("workspace")}>
					🗄
				</button>
				<button className="text-4xl" onClick={() => setCurrentView("graph")}>
					🌲
				</button>
				<button className="text-4xl" onClick={() => setCurrentView("settings")}>
					⚙️
				</button>
			</div>
		</div>
	)
}
