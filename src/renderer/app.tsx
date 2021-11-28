import type { ArbitraryFolder } from "../global-context/types"

import React from "react"

import { useAppDispatch, useAppSelector } from "./app/hooks"

import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"
import { Conditional } from "./components/conditional"
import { FileTreeGraph } from "./components/charts/file-tree"
import { useDropdown } from "./hooks/use-dropdown"
import {
	createFileOrFolder,
	fetchFileTree,
	setCurrentPath,
	setRootPath,
} from "./features/file-tree/file-tree-slice"
import { hideExplorer, toggleExplorer, toggleSearcher } from "./features/ui/ui-slice"

export const App: React.FC = () => {
	const dispatch = useAppDispatch()

	const status = useAppSelector((state) => state.fileTree.status)
	const rootPath = useAppSelector((state) => state.fileTree.rootPath)
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)
	const showExplorer = useAppSelector((state) => state.ui.showExplorer) // TODO Move explorer to Workspace
	const tree = useAppSelector((state) => state.fileTree.tree)

	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [currentView, setCurrentView] = React.useState<"workspace" | "graph" | "settings">(
		"workspace",
	)
	const [creatorRef, creatorIsOpen, openCreator, closeCreator] = useDropdown<HTMLDivElement>()
	const [creationName, setCreationName] = React.useState("")

	React.useEffect(() => {
		window.settingsAPI.get("application.root-folder-path").then((path) => {
			if (!path) {
				window.fileSystemAPI.selectRootFolder().then((path) => {
					dispatch(setCurrentPath(path))
					dispatch(setRootPath(path))
				})
			} else {
				dispatch(setRootPath(path))
			}
		})

		if (rootPath) {
			dispatch(fetchFileTree(rootPath))
		}
	}, [rootPath])

	React.useEffect(() => {
		if (currentPath) {
			window.settingsAPI.set("application.last-open-file", currentPath)
		}

		window.addEventListener("create-file", createFileListener)
		// window.addEventListener("update-tree", updateFileTreeListener)
		window.addEventListener("keydown", createFileOrFolderListener)

		return () => {
			window.removeEventListener("create-file", createFileListener)
			// window.removeEventListener("update-tree", updateFileTreeListener)
			window.removeEventListener("keydown", createFileOrFolderListener)
		}
	}, [currentPath])

	// const updateFileTreeListener = () => {
	// 	window.fileSystemAPI.listFolder(rootPath).then((data) => {
	//

	// 		window.settingsAPI.get("application.last-open-file").then((path) => {
	// 			dispatch(setCurrentPath(path))
	// 		})
	// 	})
	// }

	const createFileOrFolderListener = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === "n") {
			e.preventDefault()
			openCreator() // TODO: dispatch(toggleCreator(rootPath))
		}

		if (e.metaKey && e.key === "p") {
			e.preventDefault()
			dispatch(toggleSearcher())
		}

		if (e.metaKey && e.key === "b" && currentView === "workspace") {
			e.preventDefault()
			dispatch(toggleExplorer())
		}
	}

	const createFileListener = ({ detail }: CustomEvent) => {
		if (!detail.path || detail.path.endsWith("/.md")) {
			return
		}

		// TODO
		// window.fileSystemAPI.createFile(fileTree, detail.path).then(() => {
		// 	setCurrentFilePath(detail.path)
		// 	setCurrentView("workspace")
		// })
	}

	const toggleUnsavedFileStatus = (path: string, saved: boolean) => {
		const unsavedFilesCopy = [...unsavedFiles]

		if (saved) {
			unsavedFilesCopy.splice(unsavedFilesCopy.indexOf(path), 1)
		} else if (!unsavedFilesCopy.includes(path)) {
			unsavedFilesCopy.push(path)
		}

		setUnsavedFiles(unsavedFilesCopy)
	}

	const createFile = (folder: ArbitraryFolder, name: string) => {
		if (!name || name.endsWith("/.md")) {
			return
		}

		return (
			window.fileSystemAPI
				.createFile(folder, `${name}.md`)
				// .then(updateFileTreeListener)
				.then(() => assignCurrentPath(`${folder.path}/${name}.md`))
		)
	}

	const createFolder = (folder: ArbitraryFolder, name: string) =>
		window.fileSystemAPI.createFolder(folder, name)
	// .then(updateFileTreeListener)

	const rename = (oldPath: string, newPath: string) => window.fileSystemAPI.move(oldPath, newPath)
	// .then(updateFileTreeListener)

	const deleteItem = (path: string) =>
		window.fileSystemAPI.delete(path).then(() => {
			if (currentPath === path) {
				assignCurrentPath("")
			}
		})
	// .then(updateFileTreeListener)

	const assignCurrentPath = (path: string) => {
		window.settingsAPI.set("application.last-open-file", path)
		dispatch(setCurrentPath(path))
	}

	const selectRootDir = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.preventDefault()

		window.fileSystemAPI.selectRootFolder().then((path) => {
			dispatch(setCurrentPath(path))
			dispatch(setRootPath(path))
		})
	}

	return (
		<div className="flex">
			<div className="flex flex-grow w-full overflow-y-hidden overflow-x-hidden">
				<Conditional when={currentView === "graph" && status === "fulfilled"}>
					<div className="flex flex-col w-full flex-grow">
						<FileTreeGraph />
					</div>
					<div
						className={`${
							showExplorer ? "mr-96" : "mr-14"
						} flex flex-col w-full flex-grow overflow-y-auto overflow-x-auto`}
					>
						<Workspace toggleSaved={toggleUnsavedFileStatus} />
					</div>
				</Conditional>
			</div>

			<Conditional when={showExplorer}>
				<div className="fixed right-14 top-0 h-screen overflow-y-auto flex flex-col justify-between w-72 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
					<div>
						<h2 className="uppercase text-sm text-center text-gray-600 dark:text-gray-500">
							Explorer
						</h2>
						<FileExplorer
							unsavedFiles={unsavedFiles}
							setCurrentFile={assignCurrentPath}
							createFile={createFile}
							deleteItem={deleteItem}
							createFolder={createFolder as any}
							rename={rename}
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

			<div className="fixed right-0 w-14 top-0 h-screen overflow-y-visible overflow-x-hidden items-center flex flex-col p-4 space-y-4 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
				<button
					className="text-4xl"
					onClick={() => {
						setCurrentView("workspace")

						if (currentView === "workspace") {
							dispatch(toggleExplorer())
						}
					}}
				>
					🗄
				</button>
				<button
					className="text-4xl"
					onClick={() => {
						setCurrentView("graph")
						dispatch(hideExplorer())
					}}
				>
					🌲
				</button>
				<button
					className="text-4xl"
					onClick={() => {
						setCurrentView("settings")
						dispatch(hideExplorer())
					}}
				>
					⚙️
				</button>
			</div>

			{creatorIsOpen && (
				<div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
					<div
						ref={creatorRef}
						style={{
							top: "20%",
							left: "50%",
							transform: "translate(-50%, 0)",
							width: "70%",
							minWidth: "400px",
						}}
						className="fixed rounded-lg shadow-xl p-4 bg-gray-50"
					>
						<label className="p-1 flex flex-col space-y-2">
							<span>{rootPath}/</span>
							<input
								placeholder="Type here..."
								autoFocus={creatorIsOpen}
								className="w-full outline-none bg-gray-50"
								type="text"
								onChange={(e) => setCreationName(e.target.value)}
								value={creationName}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()

										dispatch(createFileOrFolder({ node: tree, name: creationName }))

										setCreationName("")
										closeCreator()
									}
								}}
							/>
						</label>

						<div className="text-xs text-gray-600 text-center mt-2">
							Press <kbd className="bg-pink-300 p-1 rounded-md">Enter</kbd> to apply changes or{" "}
							<kbd className="bg-pink-300 p-1 rounded-md">Esc</kbd> to drop.
						</div>

						<div className="text-xs text-gray-600 text-center mt-2">
							Ending with a <kbd className="bg-pink-300 p-1 rounded-md">/</kbd> will create a
							folder. Any other case will create an{" "}
							<kbd className="bg-pink-300 p-1 rounded-md">.md</kbd> file.
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
