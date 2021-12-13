import type { OrdoFile } from "../../../../file-tree/types";

import React from "react";
import { Draggable } from "react-beautiful-dnd";

import { useAppDispatch } from "../../../../common/state/hooks";
import { deleteFile, moveFile, setCurrentPath } from "../../../../file-tree/state/file-tree-slice";

import { escapeSlashes } from "../../../../utils/string";

const getDisplayName = (readableName: string) => readableName.replace(".md", "");

const getBadge = (readableName: string) => {
	const badge = readableName.match(/^\[.*\]\s/);

	return badge ? String(badge).slice(1, -2) : badge;
};

export const Card: React.FC<{
	file: OrdoFile;
	index: number;
}> = ({ file: item, index }) => {
	const dispatch = useAppDispatch();

	const ref = React.useRef(null);

	const [editable, setEditable] = React.useState(false);

	const displayName = getDisplayName(item.readableName);
	const badge = getBadge(item.readableName);

	const openButtonClickHandler = () => dispatch(setCurrentPath(item.path));
	const deleteButtonClickHandler = () => dispatch(deleteFile(item.path));
	const clickCardNameInputHandler = () => setEditable(true);
	const blurCardNameInputHandler = () => {
		ref.current.textContent = displayName;
		setEditable(false);
	};
	const keyDownCardNameInputHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			e.preventDefault();
			blurCardNameInputHandler();
		}

		if (e.key === "Enter") {
			e.preventDefault();

			dispatch(
				moveFile({
					oldPath: item.path,
					newPath: item.path.replace(
						item.readableName,
						`${escapeSlashes(ref.current.textContent)}.md`,
					),
				}),
			);

			setEditable(false);
		}
	};

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
						onKeyDown={keyDownCardNameInputHandler}
						onClick={clickCardNameInputHandler}
						onBlur={blurCardNameInputHandler}
					>
						{displayName}
					</div>

					<div className="flex justify-between items-center text-gray-500">
						<div className="flex space-x-2">
							<div
								className="text-xl hover:text-black cursor-pointer"
								title="Open in the workspace"
								onClick={openButtonClickHandler}
							>
								⇱
							</div>

							<div
								className="text-xl hover:text-black cursor-pointer"
								title="Delete card"
								onClick={deleteButtonClickHandler}
							>
								⤫
							</div>
						</div>

						<div className="text-sm">{badge}</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};
