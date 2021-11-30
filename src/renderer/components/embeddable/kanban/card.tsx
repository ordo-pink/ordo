import type { MDFile } from "../../../../global-context/types"

import React from "react"
import { Draggable } from "react-beautiful-dnd"

import { useAppDispatch } from "../../../app/hooks"
import {
	deleteFileOrFolder,
	moveFileOrFolder,
	setCurrentPath,
} from "../../../features/file-tree/file-tree-slice"

export const Card: React.FC<{
	item: MDFile
	index: number
}> = ({ item, index }) => {
	const [editable, setEditable] = React.useState(false)
	const ref = React.useRef(null)

	const dispatch = useAppDispatch()

	const handleOpenButtonClick = () => dispatch(setCurrentPath(item.path))

	const onBlur = () => {
		dispatch(
			moveFileOrFolder({
				node: item,
				newPath: item.path.replace(item.readableName, ref.current.textContent),
			}),
		)
	}

	const onClick = () => setEditable(true)

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()

			dispatch(
				moveFileOrFolder({
					node: item,
					newPath: item.path.replace(item.readableName, ref.current.textContent),
				}),
			)

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
						{item.readableName.replace(".md", "")}{" "}
					</div>

					<div className="flex space-x-2">
						<button className="text-xl" onClick={handleOpenButtonClick}>
							⇱
						</button>

						<button className="text-sxl" onClick={() => dispatch(deleteFileOrFolder(item))}>
							⤫
						</button>
					</div>
				</div>
			)}
		</Draggable>
	)
}
