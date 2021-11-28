import React from "react"

import { useAppDispatch, useAppSelector } from "./app/hooks"
import { Workspace } from "./components/workplace"
import { Conditional } from "./components/conditional"
import { FileTreeGraph } from "./components/charts/file-tree"
import {
	fetchFileTree,
	getCurrentPathFromSettings,
	getRootPathFromSettings,
	setCurrentPath,
	setRootPath,
} from "./features/file-tree/file-tree-slice"
import { hideExplorer, toggleCreator, toggleExplorer, toggleSearcher } from "./features/ui/ui-slice"
import { Folder } from "./components/file-explorer/folder"

export const App: React.FC = () => {
	const dispatch = useAppDispatch()

	const folder = useAppSelector((state) => state.fileTree.tree)
	const rootPath = useAppSelector((state) => state.fileTree.rootPath)
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)
	const showExplorer = useAppSelector((state) => state.ui.showExplorer) // TODO Move explorer to Workspace

	const [unsavedFiles, setUnsavedFiles] = React.useState<string[]>([])
	const [currentView, setCurrentView] = React.useState<"workspace" | "graph" | "settings">(
		"workspace",
	)

	React.useEffect(() => {
		dispatch(getCurrentPathFromSettings())
		dispatch(getRootPathFromSettings())
	}, [])

	React.useEffect(() => {
		dispatch(fetchFileTree(rootPath))
	}, [rootPath])

	React.useEffect(() => {
		if (currentPath) {
			window.settingsAPI.set("application.last-open-file", currentPath)
		}

		window.addEventListener("keydown", createFileOrFolderListener)

		return () => {
			window.removeEventListener("keydown", createFileOrFolderListener)
		}
	})

	const createFileOrFolderListener = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === "n") {
			e.preventDefault()
			dispatch(toggleCreator())
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

	const toggleUnsavedFileStatus = (path: string, saved: boolean) => {
		const unsavedFilesCopy = [...unsavedFiles]

		if (saved) {
			unsavedFilesCopy.splice(unsavedFilesCopy.indexOf(path), 1)
		} else if (!unsavedFilesCopy.includes(path)) {
			unsavedFilesCopy.push(path)
		}

		setUnsavedFiles(unsavedFilesCopy)
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
					<div className="pl-2">
						<h2 className="uppercase text-sm text-center text-gray-600 dark:text-gray-500">
							Explorer
						</h2>
						<Folder unsavedFiles={unsavedFiles} folder={folder} />
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
		</div>
	)
}
