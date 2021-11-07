import type { Folder } from "../../../../main/apis/fs/types"

import React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Card } from "./card"
import { Conditional } from "../../conditional"
import { Emoji } from "../../emoji"

export const Column: React.FC<{
	tree: Folder
	index: number
	updateColumnName: (oldPath: string, newPath: string) => void
	createCard: (cardName: string) => void
}> = ({ tree, index, updateColumnName, createCard }) => {
	const [isAddingCard, setIsAddingCard] = React.useState(false)
	const [newCardName, setNewCardName] = React.useState("")

	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		updateColumnName(tree.path, tree.path.replace(tree.readableName, e.target.textContent))
	}

	return (
		<Draggable draggableId={tree.path} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={`w-full bg-gray-200 dark:bg-gray-600 bg-${tree.color}-100 dark:bg-${tree.color}-300 rounded-lg shadow-lg flex flex-col pb-2 space-y-2`}
				>
					<div className="flex justify-between items-center p-2">
						<div
							contentEditable={true}
							suppressContentEditableWarning={true}
							className={`text-center outline-none text-xs text-${tree.color}-900`}
							onBlur={onBlur}
						>
							{tree.readableName}
						</div>

						<div className="text-2xl" {...provided.dragHandleProps}>
							𐄞
						</div>
					</div>

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
											{item.isFile ? (
												<Card item={item} index={index} updateCardName={updateColumnName} />
											) : (
												<></>
											)}
										</div>
									))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					<Conditional when={isAddingCard}>
						<input
							autoFocus={true}
							className="rounded-lg mx-2 p-2 text-center text-xs text-gray-500 border border-dashed border-gray-500"
							value={newCardName}
							onChange={(e) => setNewCardName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createCard(`${tree.path}/${newCardName}.md`)
									setNewCardName("")
								}
							}}
							onBlur={() => setIsAddingCard(false)}
						/>
						<button
							onClick={() => setIsAddingCard(true)}
							className={`rounded-lg mx-2 p-2 text-center text-xs text-gray-500 border border-dashed border-gray-500 ${
								!isAddingCard && Boolean(newCardName) && "border-yellow-700 text-yellow-700"
							}`}
						>
							+ Add card
							<Conditional when={!isAddingCard && Boolean(newCardName)}>
								<span className="ml-4">🟡</span>
							</Conditional>
						</button>
					</Conditional>
				</div>
			)}
		</Draggable>
	)
}
