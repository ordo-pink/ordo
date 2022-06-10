import { useAppDispatch } from "@core/state/store";
import { TodoNode } from "@modules/text-parser/types";
import React from "react";

type Config = {
	node: TodoNode;
	isCurrentLine: boolean;
};

export const ToDoWrapper =
	({ node, isCurrentLine }: Config): React.FC =>
	({ children }) => {
		const dispatch = useAppDispatch();

		return isCurrentLine ? (
			<span>{children}</span>
		) : (
			<div className="flex space-x-2 items-center">
				<input
					type="checkbox"
					className="block w-5 h-5 text-green-700"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					onChange={() => dispatch({ type: "@editor/toggle-todo", payload: node.range.start.line - 1 })}
					checked={node.data.checked}
				/>
				<div className={node.data.checked ? "line-through" : ""}>{children}</div>
			</div>
		);
	};
