import type { MDFile } from "../../../../global-context/types"

import React from "react"
import { Draggable } from "react-beautiful-dnd"

import { useAppDispatch } from "../../../app/hooks"
import { deleteFileOrFolder, setCurrentPath } from "../../../features/file-tree/file-tree-slice"

export const Card: React.FC<{
	item: MDFile
	index: number
	updateCardName: (oldPath: string, newPath: string) => void
}> = ({ item, index, updateCardName }) => {
	const [editable, setEditable] = React.useState(false)
	const ref = React.useRef(null)

	const dispatch = useAppDispatch()

	const handleOpenButtonClick = () => dispatch(setCurrentPath(item.path))

	const onBlur = () => {
		updateCardName(item.path, item.path.replace(item.readableName, ref.current.textContent))
	}

	const onClick = () => setEditable(true)

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()

			updateCardName(item.path, item.path.replace(item.readableName, ref.current.textContent))

			setEditable(false)
		}
	}

	return (
		<Draggable draggableId={item.readableName} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg w-full flex flex-col justify-between px-4 py-2"
				>
					<div
						ref={ref}
						className="outline-none cursor-text"
						contentEditable={editable}
						suppressContentEditableWarning={true}
						onKeyDown={onKeyDown}
						onClick={onClick}
						onBlur={onBlur}
					>
						{item.readableName}{" "}
					</div>

					<div className="flex space-x-2">
						<button className="text-xl" onClick={handleOpenButtonClick}>
							⇱
						</button>

						<button
							className="text-sxl"
							onClick={(e) => {
								e.preventDefault()

								dispatch(deleteFileOrFolder(item))
							}}
						>
							⤫
						</button>
					</div>
				</div>
			)}
		</Draggable>
	)
}
