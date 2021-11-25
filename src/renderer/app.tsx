import type { ArbitraryFile, ArbitraryFolder, MDFile } from "../global-context/types"

import React from "react"
import Fuse from "fuse.js"

import { findFileByName } from "../utils/tree"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"
import { isFolder } from "../global-context/init"
import { Conditional } from "./components/conditional"
import { FileTreeGraph } from "./components/charts/file-tree"
import { useDropdown } from "./hooks/use-dropdown"

const createSearchTerms = (data: ArbitraryFolder | ArbitraryFile, terms: any[] = []) => {
	if (!isFolder(data)) {
		terms.push({
			readableName: data.readableName,
			path: data.path,
		})
	} else {
		for (const child of data.children) {
			createSearchTerms(child, terms)
		}
	}

	return terms
}

export const App: React.FC = () => {
	const [rootPath, setRootPath] = React.useState("")
	const [fileTree, setFileTree] = React.useState(null as ArbitraryFolder)
	const [hash, setHash] = React.useState("")
	const [currentFilePath, setCurrentFilePath] = React.useState("")
	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [currentView, setCurrentView] = React.useState<"workspace" | "graph" | "settings">(
		"workspace",
	)
	const [displayExplorer, setDisplayExplorer] = React.useState<boolean>(false)

	const [creatorRef, creatorIsOpen, openCreator, closeCreator] = useDropdown<HTMLDivElement>()
	const [searcherRef, searcherIsOpen, openSearcher, closeSearcher] = useDropdown<HTMLDivElement>()
	const [creationName, setCreationName] = React.useState("")
	const [search, setSearch] = React.useState("")
	const [searchTerms, setSearchTerms] = React.useState(null)
	const [fuse, setFuse] = React.useState(null)
	const [found, setFound] = React.useState(null)
	const [preselectedSearchItem, setPreselectedSearchItem] = React.useState(0)

	React.useEffect(() => {
		if (currentFilePath) {
			window.settingsAPI.set("application.last-open-file", currentFilePath)
		}
	}, [currentFilePath])

	React.useEffect(() => {
		if (searchTerms) {
			setFuse(
				new Fuse(searchTerms, {
					includeScore: true,
					keys: [
						{ name: "readableName", weight: 0.7 },
						{ name: "path", weight: 0.3 },
					],
				}),
			)
		}
	}, [searchTerms, setFuse])

	const updateFileTreeListener = () => {
		window.fileSystemAPI.listFolder(rootPath).then((data) => {
			setFileTree(data)
			setHash(data.hash)
			setSearchTerms(createSearchTerms(data))

			window.settingsAPI.get("application.last-open-file").then(setCurrentFilePath)
		})
	}

	const createFileOrFolderListener = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === "n") {
			e.preventDefault()
			openCreator()
		}

		if (e.metaKey && e.key === "p") {
			e.preventDefault()
			openSearcher()
		}

		if (e.metaKey && e.key === "b") {
			e.preventDefault()
			setDisplayExplorer((current) => !current)
		}
	}

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
						setCurrentFilePath(node.path)
						setCurrentView("workspace")
					}
				}
			} else {
				node = findFileByName(fileTree, detail.path)

				if (node.isFile) {
					setCurrentFilePath(node.path)
					setCurrentView("workspace")
				}
			}
		} else {
			setCurrentFilePath(detail.path)
			setCurrentView("workspace")
		}
	}

	const createFileListener = ({ detail }: CustomEvent) => {
		if (!detail.path || detail.path.endsWith("/.md")) {
			return
		}

		window.fileSystemAPI.createFile(fileTree, detail.path).then(() => {
			setCurrentFilePath(detail.path)
			setCurrentView("workspace")
		})
	}

	React.useEffect(() => {
		window.addEventListener("set-current-file", setCurrentFileListener)
		window.addEventListener("create-file", createFileListener)
		window.addEventListener("update-tree", updateFileTreeListener)
		window.addEventListener("keydown", createFileOrFolderListener)

		return () => {
			window.removeEventListener("set-current-file", setCurrentFileListener)
			window.removeEventListener("create-file", createFileListener)
			window.removeEventListener("update-tree", updateFileTreeListener)
			window.removeEventListener("keydown", createFileOrFolderListener)
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

	const createFile = (folder: ArbitraryFolder, name: string) => {
		if (!name || name.endsWith("/.md")) {
			return
		}

		return window.fileSystemAPI
			.createFile(folder, `${name}.md`)
			.then(updateFileTreeListener)
			.then(() => assignCurrentPath(`${folder.path}/${name}.md`))
	}

	const createFolder = (folder: ArbitraryFolder, name: string) =>
		window.fileSystemAPI.createFolder(folder, name).then(updateFileTreeListener)

	const rename = (oldPath: string, newPath: string) =>
		window.fileSystemAPI.move(oldPath, newPath).then(updateFileTreeListener)

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
				<Conditional when={currentView === "graph" && Boolean(fileTree)}>
					<div className="flex flex-col w-full flex-grow">
						<FileTreeGraph data={{ ...fileTree, hash }} />
					</div>
					<div
						className={`${
							displayExplorer ? "mr-96" : "mr-14"
						} flex flex-col w-full flex-grow overflow-y-auto overflow-x-auto`}
					>
						<Workspace currentFilePath={currentFilePath} toggleSaved={toggleUnsavedFileStatus} />
					</div>
				</Conditional>
			</div>

			<Conditional when={displayExplorer}>
				<div className="fixed right-14 top-0 h-screen overflow-y-auto flex flex-col justify-between w-72 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
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

			<div className="fixed right-0 w-14 top-0 h-screen overflow-y-visible overflow-x-hidden items-center flex flex-col p-4 space-y-4 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
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

			{creatorIsOpen && (
				<div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
					<div
						ref={creatorRef}
						style={{
							top: "20%",
							left: "50%",
							transform: "translate(-50%, 0)",
							width: "40%",
							minWidth: "400px",
						}}
						className="fixed rounded-lg shadow-xl p-4 bg-gray-50"
					>
						<label className="p-1 flex">
							<span>{fileTree.path}/</span>
							<input
								autoFocus={creatorIsOpen}
								className="w-full outline-none bg-gray-50"
								type="text"
								onChange={(e) => setCreationName(e.target.value)}
								value={creationName}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()

										if (!creationName.endsWith("/")) {
											createFile(fileTree, creationName)
										} else if (creationName.endsWith("/")) {
											createFolder(fileTree, creationName)
										}

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

			{searcherIsOpen && (
				<div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
					<div
						ref={searcherRef}
						style={{
							top: "20%",
							left: "50%",
							transform: "translate(-50%, 0)",
							width: "70%",
							minWidth: "400px",
						}}
						className="fixed rounded-lg shadow-xl p-4 bg-gray-50"
					>
						<label className="flex-col space-y-2">
							<span className="text-xl">Looking for something?</span>
							<input
								placeholder="Drama queen..."
								autoFocus={searcherIsOpen}
								className="w-full outline-none bg-gray-50"
								type="text"
								onChange={(e) => {
									setSearch(e.target.value)
									setFound(fuse.search(e.target.value))

									if (found && found.length) {
										setPreselectedSearchItem(0)
									}
								}}
								value={search}
								onKeyDown={(e) => {
									if (e.key === "ArrowUp") {
										e.preventDefault()

										if (preselectedSearchItem === 0) {
											setPreselectedSearchItem(found.length ? found.length - 1 : 0)
										} else {
											setPreselectedSearchItem((item) => item - 1)
										}
									}

									if (e.key === "ArrowDown") {
										e.preventDefault()

										if (preselectedSearchItem === found.length - 1) {
											setPreselectedSearchItem(0)
										} else {
											setPreselectedSearchItem((item) => item + 1)
										}
									}

									if (e.key === "Enter") {
										e.preventDefault()

										setCurrentFilePath(found[preselectedSearchItem].item.path)

										setPreselectedSearchItem(0)
										setFound(null)
										setSearch("")
										closeSearcher()
									}
								}}
							/>
						</label>

						<div className="rounded-xl shadow-xl mt-4 overflow-y-auto">
							{found &&
								found.slice(0, 6).map((page: any, i: number) => (
									<div
										onClick={() => {
											setCurrentFilePath(page.item.path)
											setFound(null)
											setPreselectedSearchItem(0)
											setSearch("")
										}}
										key={page.item.path}
										className={`p-2 w-full flex flex-col space-y-2 cursor-pointer ${
											preselectedSearchItem === i && " bg-purple-300"
										}`}
									>
										<div className="text-sm text-gray-700">{page.item.readableName}</div>
										<div className="text-xs text-mono text-gray-500">{page.item.path}</div>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
