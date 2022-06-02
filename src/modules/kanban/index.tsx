import React from "react";
import { Either } from "or-else";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";

import { useAppSelector } from "@core/state/store";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";
import { id, tap } from "@utils/functions";
import { Column } from "./components/column";
import { NodeWithChars } from "@core/parser/types";
import { Columns, Tasks } from "./types";
import { collectFolders } from "@modules/file-explorer/utils/collect-folders";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { FoldVoid } from "@utils/either";
import { NoOp, noOpFn } from "@utils/no-op";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";

import "@modules/kanban/index.css";

type Props = {
	token: NodeWithChars;
};

export const Kanban: React.FC<Props> = React.memo(
	({ token }) => {
		const tree = useAppSelector((state) => state.fileExplorer.tree);

		const [height, setHeight] = React.useState<string>("40vh");
		const [width, setWidth] = React.useState<string>("100%");
		const [displayProperties, setDisplayProperties] = React.useState<string[]>([]);
		const [columns, setColumns] = React.useState<Columns>({});
		const [tasks, setTasks] = React.useState<Tasks>({});
		const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

		React.useEffect(() => {
			const parsed: string[] = token.data.parsed as string[];

			Either.fromNullable(tree)
				.chain((t) =>
					Either.fromNullable(parsed.find((attr) => attr.startsWith("folder=")))
						.map((attr) => attr.slice(8, -1))
						.chain((folder) => Either.fromNullable(findOrdoFolder(t, "readableName", folder))),
				)
				.map(
					tap((tree) => {
						const columns = collectFolders(tree).reduce(
							(acc, column) => ({
								...acc,
								[column.readableName]: { ...column, tasks: collectFiles(column).map((task) => task.path) },
							}),
							{},
						);

						setColumns(columns);
						setColumnOrder(Object.keys(columns));
					}),
				)
				.map((tree) =>
					setTasks(
						collectFiles(tree).reduce((acc, task) => (task.type === "document" ? { ...acc, [task.path]: task } : acc), {}),
					),
				)
				.fold(...FoldVoid);

			Either.fromNullable(parsed.find((attr) => attr.startsWith("properties=")))
				.map((attr) => attr.slice(12, -1))
				.map((properties) => properties.split(","))
				.fold(
					() => setDisplayProperties([]),
					(ps) => setDisplayProperties(ps),
				);

			Either.fromNullable(parsed.find((attr) => attr.startsWith("height=")))
				.map((attr) => attr.slice(8, -1))
				.fold(
					() => setHeight("40vh"),
					(v) => setHeight(v),
				);

			Either.fromNullable(parsed.find((attr) => attr.startsWith("order=")))
				.map((attr) => attr.slice(7, -1))
				.map((folders) => folders.split(","))
				.fold(noOpFn, (v) => setColumnOrder(v));

			Either.fromNullable(parsed.find((attr) => attr.startsWith("width=")))
				.map((attr) => attr.slice(7, -1))
				.fold(
					() => setWidth("100%"),
					(v) => setWidth(v),
				);
		}, [tree]);

		const handleClick = (e: React.MouseEvent) =>
			Either.of(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.fold(...FoldVoid);

		const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
			const { destination, source, draggableId } = result;

			if (!destination) return;
			if (destination.droppableId === source.droppableId && destination.index === source.index) return;

			const start = columns[source.droppableId];
			const finish = columns[destination.droppableId];

			if (start.path === finish.path) {
				const newTasks = Array.from(start.tasks);

				newTasks.splice(source.index, 1);
				newTasks.splice(destination.index, 0, draggableId);

				const newColumn = {
					...start,
					tasks: newTasks,
				};

				setColumns({
					...columns,
					[newColumn.readableName]: newColumn,
				});

				// TODO: Send state snapshot and handle line updates
				return;
			}

			const startTasks = Array.from(start.tasks);
			startTasks.splice(source.index, 1);

			const newStart = {
				...start,
				tasks: startTasks,
			};

			const finishTasks = Array.from(finish.tasks);
			finishTasks.splice(destination.index, 0, draggableId);

			const newFinish = {
				...finish,
				tasks: finishTasks,
			};

			setColumns({
				...columns,
				[newStart.readableName]: newStart,
				[newFinish.readableName]: newFinish,
			});
		};

		return (
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="w-full flex space-x-2 rounded-lg cursor-auto" style={{ width, height }} onClick={handleClick}>
					{columnOrder.map((columnId) =>
						Either.fromNullable(columns)
							.chain((cs) => Either.fromNullable(cs[columnId]))
							.chain((c) =>
								Either.fromNullable(c.tasks)
									.map((ts) => ts.map((id) => tasks[id]))
									.map((ts) => <Column key={c.path} column={c} tasks={ts} displayProperties={displayProperties} />),
							)
							.fold(NoOp, id),
					)}
				</div>
			</DragDropContext>
		);
	},
	() => true,
);
