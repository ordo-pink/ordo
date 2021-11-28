import type { ArbitraryFolder, MDFile } from "../../../../global-context/types"

import React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Card } from "./card"
import { Conditional } from "../../conditional"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
	createFileOrFolder,
	deleteFileOrFolder,
	moveFileOrFolder,
} from "../../../features/file-tree/file-tree-slice"
import { findNode } from "../../../../utils/tree"

export const Column: React.FC<{
	treePath: string
	index: number
}> = ({ treePath, index }) => {
	const dispatch = useAppDispatch()

	const rootTree = useAppSelector((state) => state.fileTree.tree) as ArbitraryFolder

	const [tree, setTree] = React.useState<ArbitraryFolder>(null)

	React.useEffect(() => {
		if (rootTree) {
			setTree(
				findNode(
					rootTree,
					"path",
					treePath, // TODO: Add path resolution
				) as ArbitraryFolder,
			)
		}
	}, [rootTree, treePath])

	const [isAddingCardAtTheTop, setIsAddingCardAtTheTop] = React.useState(false)
	const [isAddingCardAtTheBottom, setIsAddingCardAtTheBottom] = React.useState(false)
	const [newCardName, setNewCardName] = React.useState("")

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()

			if (isAddingCardAtTheBottom || isAddingCardAtTheTop) {
				dispatch(createFileOrFolder({ node: tree, name: `${newCardName}.md` }))
				setNewCardName("")
			} else {
				dispatch(
					moveFileOrFolder({
						node: tree,
						newPath: tree.path.replace(tree.readableName, e.currentTarget.textContent),
					}),
				)
			}
		}
	}

	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		dispatch(
			moveFileOrFolder({
				node: tree,
				newPath: tree.path.replace(tree.readableName, e.currentTarget.textContent),
			}),
		)
	}

	return (
		tree && (
			<Draggable draggableId={tree.path} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						style={{ minWidth: "18rem", maxWidth: "18rem" }}
						className={`bg-gray-200 dark:bg-gray-600 rounded-lg shadow-md flex flex-col pb-2 space-y-2`}
					>
						<div className="flex justify-between items-center p-2">
							<div
								contentEditable={true}
								suppressContentEditableWarning={true}
								className={`text-center outline-none text-xs`}
								onBlur={onBlur}
								onKeyDown={onKeyDown}
							>
								{tree.readableName}
							</div>

							<div className="flex space-x-2 items-center">
								<button
									className="text-sxl"
									onClick={() => {
										dispatch(deleteFileOrFolder(tree))
									}}
								>
									⤫
								</button>

								<div className="text-2xl" {...provided.dragHandleProps}>
									𐄞
								</div>
							</div>
						</div>

						<Conditional when={isAddingCardAtTheTop}>
							<input
								autoFocus={isAddingCardAtTheTop}
								className="rounded-lg outline-none mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500"
								value={newCardName}
								onChange={(e) => setNewCardName(e.target.value)}
								onKeyDown={onKeyDown}
								onBlur={() => setIsAddingCardAtTheTop(false)}
							/>
							<button
								onClick={() => setIsAddingCardAtTheTop(true)}
								className={`rounded-lg mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500 ${
									!isAddingCardAtTheTop &&
									Boolean(newCardName) &&
									"border-yellow-700 text-yellow-700"
								}`}
							>
								+ Add card
								<Conditional when={!isAddingCardAtTheTop && Boolean(newCardName)}>
									<span className="ml-4">🟡</span>
								</Conditional>
							</button>
						</Conditional>

						<Droppable direction="vertical" droppableId={tree.path} type="card">
							{(provided) => (
								<div
									className={`px-2 flex flex-col space-y-2 h-full`}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{tree.children &&
										tree.children.map((item, index) => (
											<div key={item.path}>
												{item.isFile ? <Card item={item as MDFile} index={index} /> : <></>}
											</div>
										))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>

						<Conditional when={tree.children && tree.children.length > 0}>
							<Conditional when={isAddingCardAtTheBottom}>
								<input
									autoFocus={isAddingCardAtTheBottom}
									className="rounded-lg outline-none mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500"
									value={newCardName}
									onChange={(e) => setNewCardName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault()
											dispatch(createFileOrFolder({ node: tree, name: `${newCardName}.md` }))
											setNewCardName("")
										}
									}}
									onBlur={() => setIsAddingCardAtTheBottom(false)}
								/>
								<button
									onClick={() => setIsAddingCardAtTheBottom(true)}
									className={`rounded-lg mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500 ${
										!isAddingCardAtTheBottom &&
										Boolean(newCardName) &&
										"border-yellow-700 text-yellow-700"
									}`}
								>
									+ Add card
									<Conditional when={!isAddingCardAtTheBottom && Boolean(newCardName)}>
										<span className="ml-4">🟡</span>
									</Conditional>
								</button>
							</Conditional>
						</Conditional>
					</div>
				)}
			</Draggable>
		)
	)
}
