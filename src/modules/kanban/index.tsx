import React from "react";
import { Either } from "or-else";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";

import { useAppDispatch, useAppSelector } from "@core/state/store";
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
import { OrdoFolder } from "@modules/file-explorer/types";
import { useIcon } from "@core/hooks/use-icon";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

type Props = {
	token: NodeWithChars;
};

export const Kanban: React.FC<Props> = React.memo(
	({ token }) => {
		const dispatch = useAppDispatch();

		const tree = useAppSelector((state) => state.fileExplorer.tree);

		const createColumnInputRef = React.useRef<HTMLInputElement>(null);

		const [height, setHeight] = React.useState<string>("40vh");
		const [width, setWidth] = React.useState<string>("100%");
		const [folder, setFolder] = React.useState<OrdoFolder | null>(null);
		const [displayProperties, setDisplayProperties] = React.useState<string[]>([]);
		const [columns, setColumns] = React.useState<Columns>({});
		const [tasks, setTasks] = React.useState<Tasks>({});
		const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
		const [showBackground, setShowBackground] = React.useState<boolean>(true);
		const [showColumnCreationInput, setShowColumnCreationInput] = React.useState<boolean>(false);
		const [createColumnInputValue, setCreateInputColumnValue] = React.useState<string>("");

		const PlusIcon = useIcon("HiPlus");

		React.useEffect(() => {
			if (createColumnInputRef.current && showColumnCreationInput) {
				createColumnInputRef.current.focus();
			}
		}, [createColumnInputRef.current, showColumnCreationInput]);

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

						setFolder(tree);
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

			Either.fromNullable(parsed.find((attr) => attr === "no-background")).fold(
				() => setShowBackground(true),
				() => setShowBackground(false),
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

			const file = findOrdoFile(tree, "path", draggableId);

			if (!file) return;

			dispatch({
				type: "@file-explorer/move",
				payload: {
					oldPath: file.path,
					newFolder: finish.path,
					name: file.readableName,
				},
			});
		};

		const handleColumnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setCreateInputColumnValue(e.target.value);
		const handleColumnInputFocus = () => dispatch({ type: "@editor/unfocus" });
		const handleColumnInputBlur = () => {
			setCreateInputColumnValue("");
			setShowColumnCreationInput(false);
		};
		const handleColumnInputKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				createColumnInputRef.current?.blur();
			} else if (e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();
				dispatch({
					type: "@file-explorer/create-folder",
					payload: {
						parentPath: folder!.path,
						name: createColumnInputValue,
					},
				});
				createColumnInputRef.current?.blur();
			}
		};

		const handleBeforeDragStart = () => dispatch({ type: "@editor/unfocus" });
		const handleAddColumnClick = (e: React.MouseEvent) =>
			Either.of(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.map(() => setShowColumnCreationInput((prev) => !prev))
				.fold(...FoldVoid);

		return (
			<div
				onClick={(e) =>
					Either.fromNullable(e)
						.map(tapPreventDefault)
						.map(tapStopPropagation)
						.fold(...FoldVoid)
				}
				className={`flex flex-col space-y-2 rounded-lg cursor-auto ${
					showBackground ? "rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-lg p-2 overflow-auto" : ""
				}`}
			>
				<div className="flex space-x-2 items-center">
					<h1 className="font-bold tracking-wide">{folder?.readableName}</h1>
					<div className="flex space-x-2 items-center">
						<button
							className={`transition-colors duration-200 ${
								showColumnCreationInput ? "text-rose-500" : "text-neutral-500 dark:text-neutral-400"
							}`}
							title="Add column"
							onClick={handleAddColumnClick}
						>
							<PlusIcon />
						</button>
					</div>
				</div>
				<DragDropContext onDragEnd={handleDragEnd} onBeforeDragStart={handleBeforeDragStart}>
					<div className={`flex space-x-2 w-full  `} style={{ width, height }} onClick={handleClick}>
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
						{showColumnCreationInput && (
							<div>
								<input
									ref={createColumnInputRef}
									value={createColumnInputValue}
									onChange={handleColumnInputChange}
									onKeyDown={handleColumnInputKeyDown}
									onFocus={handleColumnInputFocus}
									onBlur={handleColumnInputBlur}
									type="text"
									placeholder="+ Add column..."
									className="w-full bg-transparent border-0 outline-pink-400 dark:outline-purple-500"
								/>
							</div>
						)}
					</div>
				</DragDropContext>
			</div>
		);
	},
	() => true,
);
