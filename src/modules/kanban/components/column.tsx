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
	return (
		<div className={`column w-1/3 max-w-xs min-w-[250px] column_${column.color} rounded-lg overflow-auto`}>
			<div className={`uppercase font-bold text-center column_${column.color} py-2`}>
				<h3>{column.readableName}</h3>
			</div>

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
	);
};
