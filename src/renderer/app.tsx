import type { ArbitraryFolder, MDFile } from "../global-context/types"

import React from "react"

import { findFileByName, findFileByPath } from "../utils/tree"
import { FileExplorer } from "./components/file-explorer"
import { Workspace } from "./components/workplace"
import { isFolder } from "../global-context/init"

import {
	hierarchy as createHierarchy,
	HierarchyNode,
	forceSimulation,
	forceLink,
	forceManyBody,
	forceX,
	forceY,
	Simulation,
	drag as d3Drag,
	zoom,
	select,
} from "d3"
import { Hashed } from "../main/apis/hash-response"
import { useD3 } from "./hooks/use-d3"
import { Conditional } from "./components/conditional"

const drag = (simulation: Simulation<any, any>) =>
	d3Drag()
		.on("start", (event, d: any) => {
			if (!event.active) {
				simulation.alphaTarget(0.3).restart()
			}

			d.fx = d.x
			d.fy = d.y
		})
		.on("drag", (event, d: any) => {
			d.fx = event.x
			d.fy = event.y
		})
		.on("end", (event, d: any) => {
			if (!event.active) {
				simulation.alphaTarget(0)
			}

			d.fx = null
			d.fy = null
		})

export const D3View: React.FC<{ hierarchy: HierarchyNode<Hashed<ArbitraryFolder>> }> = ({
	hierarchy,
}) => {
	const svgRef = React.useRef(null)

	React.useEffect(() => {
		if (!svgRef) {
			return
		}

		const links: any = hierarchy.links()
		const nodes: any = hierarchy.descendants()

		const simulation = forceSimulation(nodes)
			.force(
				"link",
				forceLink(links)
					.id((d: any) => {
						return d.data.index
					})
					.distance(0)
					.strength(1),
			)
			.force("change", forceManyBody().strength(-50))
			.force("x", forceX())
			.force("y", forceY())

		const container = select(svgRef.current)

		container
			.attr(
				"viewBox",
				`${-window.innerWidth / 2}, ${-window.innerHeight / 2}, ${window.innerWidth}, ${
					window.innerHeight
				}`,
			)
			.call(zoom().on("zoom", (e) => container.attr("transform", e.transform)))

		const link = container
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-width", 0.2)
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")

		const node = container
			.append("g")
			.attr("fill", "#fff")
			.attr("stroke", "#000")
			.attr("stroke-width", 0.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("fill", (d: any) => (d.children ? null : "#000"))
			.attr("stroke", (d: any) => (d.children ? null : "#fff"))
			.attr("r", 3.5)
			.call(drag(simulation))

		node.append("text").text((d: any) => d.data.readableName)

		simulation.on("tick", () => {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y)

			node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
		})
	}, [svgRef.current, hierarchy.data.hash])

	return <svg ref={svgRef} width={window.innerWidth} height={window.innerHeight} />
}

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
					}
				}
			} else {
				node = findFileByName(fileTree, detail.path)

				if (node.isFile) {
					setCurrentFileMetadata(node)
					setCurrentFilePath(node.path)
				}
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
						<D3View hierarchy={hierarchy} />
					</div>
					<div className="flex flex-col w-full flex-grow overflow-y-auto  overflow-x-auto">
						<Workspace
							currentFilePath={currentFilePath}
							metadata={currentFileMetadata}
							toggleSaved={toggleUnsavedFileStatus}
						/>
					</div>
				</Conditional>
			</div>

			<Conditional when={currentView === "workspace"}>
				<div className="fixed right-16 top-0 h-screen overflow-y-auto flex flex-col justify-between w-2/12 border-l border-gray-300 dark:border-gray-900 py-4 bg-gray-100 dark:bg-gray-700">
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
