import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch } from "@core/state/store";
import React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Column as TColumn, Task as TTask } from "../types";
import { Task } from "./task";

type Props = {
	column: TColumn;
	tasks: TTask[];
	displayProperties: string[];
};

export const Column: React.FC<Props> = ({ column, tasks, displayProperties }) => {
	const dispatch = useAppDispatch();
	const XIcon = useIcon("HiX");

	const ref = React.useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = React.useState<string>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
	const handleInputFocus = () => dispatch({ type: "@editor/unfocus" });
	const handleInputBlur = () => setInputValue("");
	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			e.stopPropagation();

			const name = inputValue.trim();

			dispatch({
				type: "@file-explorer/create-file",
				payload: { name, parentPath: column.path },
			});

			ref.current!.blur();
		} else if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();

			ref.current!.blur();
		}
	};

	return (
		<div className={`column w-1/3 max-w-xs min-w-[250px] column_${column.color} rounded-lg`}>
			<div className={`uppercase flex justify-between items-center px-2 font-bold column_${column.color} py-2`}>
				<h3>{column.readableName}</h3>
				<div>
					<button onClick={() => dispatch({ type: "@file-explorer/remove-folder", payload: column.path })}>
						<XIcon
							title="Remove column"
							className="text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300 cursor-pointer"
						/>
					</button>
				</div>
			</div>

			<div className="column_task-list">
				<Droppable droppableId={column.readableName}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`flex flex-col space-y-2 p-2 transition-colors duration-300 min-h-full ${
								snapshot.isDraggingOver ? "bg-neutral-400 dark:bg-neutral-700 bg-opacity-30" : "transparent"
							}`}
						>
							{tasks.map((task, index) => (
								<Task key={task.path} task={task} index={index} displayProperties={displayProperties} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>

			<input
				type="text"
				className="w-full bg-transparent border-0 py-1 px-2 flex-shrink-0"
				placeholder="+ Add card"
				ref={ref}
				value={inputValue}
				onKeyDown={handleInputKeyDown}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				onChange={handleInputChange}
			/>
		</div>
	);
};
