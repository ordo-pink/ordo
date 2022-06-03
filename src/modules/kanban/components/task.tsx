import React from "react";
import { Draggable } from "react-beautiful-dnd";

import { useIcon } from "@core/hooks/use-icon";
import { OrdoFile } from "@modules/file-explorer/types";
import { Either } from "or-else";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { useAppDispatch } from "@core/state/store";
import { Task as TTask } from "../types";

type Props = {
	task: TTask;
	index: number;
	displayProperties: string[];
};

export const Task: React.FC<Props> = ({ task, displayProperties, index }) => {
	const dispatch = useAppDispatch();

	const LinkIcon = useIcon("HiOutlineLink");
	const XIcon = useIcon("HiX");
	const TagIcon = useIcon("HiOutlineTag");

	const handleLinkClick = (e: React.MouseEvent) =>
		Either.of(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() =>
				dispatch({
					type: "@editor/open-tab",
					payload: task.path,
				}),
			);

	const handleRemoveClick = (e: React.MouseEvent) =>
		Either.of(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() =>
				dispatch({
					type: "@file-explorer/remove-file",
					payload: task.path,
				}),
			);

	return (
		<Draggable draggableId={task.path} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`p-2 bg-gradient-to-br outline-pink-400 dark:outline-purple-500 rounded-lg whitespace-pre-wrap flex space-x-1 shadow-md transition-colors duration-300 ${
						snapshot.isDragging
							? "from-stone-100 dark:from-stone-700 to-stone-200 dark:to-stone-800"
							: "from-neutral-50 dark:from-neutral-700 to-neutral-100 dark:to-neutral-800"
					}`}
				>
					<div className="flex flex-col space-y-2 flex-grow">
						<div>{task.readableName}</div>
						<div className="flex space-x-2">
							{displayProperties.includes("links") && task.frontmatter && task.frontmatter.links.length > 0 && (
								<div className="text-sm">
									<div className="flex space-x-1 items-center text-neutral-500 dark:text-neutral-400">
										<LinkIcon />
										<div>{task.frontmatter!.links.length}</div>
									</div>
								</div>
							)}
							{displayProperties.includes("tags") && task.frontmatter && (
								<div className="text-sm">
									<div className="flex flex-wrap space-x-1 text-neutral-500 dark:text-neutral-400">
										{task.frontmatter.tags.map((tag: string) => (
											<div
												className="font-bold bg-gradient-to-tr from-orange-600 dark:from-purple-400 to-pink-700 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-xl"
												key={tag}
											>
												#{tag}
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="pt-1 flex items-center justify-between">
							<button className="outline-pink-400 dark:outline-purple-500" onClick={handleLinkClick}>
								<LinkIcon
									title={`Open "${task.readableName}" in a new tab`}
									className="text-neutral-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
								/>
							</button>
							<button className="outline-pink-400 dark:outline-purple-500" onClick={handleRemoveClick}>
								<XIcon
									title="Remove card"
									className="text-neutral-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
								/>
							</button>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};
