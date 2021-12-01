import type { OrdoFile, OrdoFolder } from "../global-context/types"

import React from "react"
import Fuse from "fuse.js"

import { useAppDispatch, useAppSelector } from "./app/hooks"
import { setCurrentPath } from "./features/file-tree/file-tree-slice"
import { isFolder } from "../global-context/init"
import { setCurrentView, toggleSearcher } from "./features/ui/ui-slice"

interface SearchTerm {
	readableName: string
	path: string
}

const createSearchTerms = (data: OrdoFolder | OrdoFile, terms: SearchTerm[] = []) => {
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

export const Searcher: React.FC = () => {
	const dispatch = useAppDispatch()
	const tree = useAppSelector((state) => state.fileTree.tree)
	const searcherIsOpen = useAppSelector((state) => state.ui.showSearcher)

	const ref = React.useRef()

	const [search, setSearch] = React.useState("")
	const [searchTerms, setSearchTerms] = React.useState(null)
	const [fuse, setFuse] = React.useState<Fuse<OrdoFile>>(null)
	const [found, setFound] = React.useState<Fuse.FuseResult<OrdoFile>[]>(null)
	const [preselectedSearchItem, setPreselectedSearchItem] = React.useState(0)

	React.useEffect(() => {
		if (tree) {
			setSearchTerms(createSearchTerms(tree))
		}
	}, [tree])

	React.useEffect(() => {
		if (searchTerms) {
			setFuse(
				new Fuse(searchTerms, {
					includeScore: true,
					keys: [
						{ name: "readableName", weight: 0.6 },
						{ name: "path", weight: 0.4 },
					],
				}),
			)
		}

		return () => {
			setFuse(null)
		}
	}, [searchTerms, setFuse])

	return (
		searcherIsOpen && (
			<div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
				<div
					ref={ref}
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
								if (e.key === "Escape") {
									e.preventDefault()

									setPreselectedSearchItem(0)
									setFound(null)
									setSearch("")
									dispatch(toggleSearcher())
								}

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

									dispatch(setCurrentPath(found[preselectedSearchItem].item.path))
									dispatch(setCurrentView("workspace"))
									dispatch(toggleSearcher())

									setPreselectedSearchItem(0)
									setFound(null)
									setSearch("")
								}
							}}
						/>
					</label>

					<div className="rounded-xl shadow-xl mt-4 overflow-y-auto">
						{found &&
							found.slice(0, 6).map((page, index) => (
								<div
									onClick={() => {
										dispatch(setCurrentPath(page.item.path))
										dispatch(setCurrentView("workspace"))
										dispatch(toggleSearcher())

										setFound(null)
										setPreselectedSearchItem(0)
										setSearch("")
										dispatch(toggleSearcher())
									}}
									key={page.item.path}
									className={`p-2 w-full flex flex-col space-y-2 cursor-pointer ${
										preselectedSearchItem === index && " bg-purple-300"
									}`}
								>
									<div className="text-sm text-gray-700">{page.item.readableName}</div>
									<div className="text-xs text-mono text-gray-500">{page.item.path}</div>
								</div>
							))}
					</div>
				</div>
			</div>
		)
	)
}
