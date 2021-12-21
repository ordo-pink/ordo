import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addStatusBarItem, removeStatusBarItem } from "../status-bar/state";
import { Line } from "./line";
import { getStatusBarWidget } from "./status-bar-widget";
import { CaretPosition, ChangeSelection, ChangeResponse } from "./types";

const IGNORED_KEY_PRESSES = ["Meta", "Control", "Alt", "Shift", "CapsLock"];
const STATUS_BAR_WIDGET_ID = "EDITOR_CARET_POSITION";

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();

	const tabs = useAppSelector((state) => state.editor.tabs);
	const currentTab = useAppSelector((state) => state.editor.currentTab);

	const ref = React.useRef<HTMLDivElement>(null);

	const [content, setContent] = React.useState<string[]>(null);

	const [mouseDownPosition, setMouseDownPosition] = React.useState<CaretPosition>(null);
	const [selection, setSelection] = React.useState<ChangeSelection>({
		start: {
			line: 0,
			index: 0,
		},
		end: {
			line: 0,
			index: 0,
		},
		direction: "ltr",
	});

	React.useEffect(() => {
		if (!tabs.length) {
			return;
		}

		dispatch(
			addStatusBarItem({
				id: STATUS_BAR_WIDGET_ID,
				position: "right",
				value: getStatusBarWidget({ selection, content }),
			}),
		);

		setContent(tabs[currentTab].body);

		return () => {
			setContent(null);
			dispatch(removeStatusBarItem({ id: STATUS_BAR_WIDGET_ID, position: "right" }));
		};
	}, [tabs, currentTab]);

	React.useEffect(() => {
		if (!content || !ref.current || !selection) {
			return;
		}

		window.addEventListener("keydown", onKeyDown);

		const node =
			selection.direction === "rtl"
				? document.getElementById(`line-${selection.start.line}-${selection.start.index}`)
				: document.getElementById(`line-${selection.end.line}-${selection.end.index}`);

		node && node.classList.add("caret");

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			node && node.classList.remove("caret");
		};
	}, [selection.start.index, selection.start.line, selection.end.index, selection.end.line, selection.direction]);

	const onKeyDown = (e: KeyboardEvent) => {
		const { key, metaKey, altKey, ctrlKey, shiftKey } = e;

		if (IGNORED_KEY_PRESSES.includes(key)) {
			return;
		}

		e.preventDefault();

		window.Editor.onKeyDown({
			selection,
			keys: { key, metaKey, altKey, ctrlKey, shiftKey },
		}).then(({ selection, content }: ChangeResponse) => {
			setContent(content);
			setSelection(selection);
		});
	};

	const mouseUpHandler = (index: number, line: number) => {
		if (mouseDownPosition && (mouseDownPosition.index !== index || mouseDownPosition.line !== line)) {
			const isMouseDownBefore =
				mouseDownPosition.line < line || (mouseDownPosition.line === line && mouseDownPosition.index < index);
			const direction = isMouseDownBefore ? "ltr" : "rtl";

			return setSelection(
				isMouseDownBefore
					? { start: mouseDownPosition, end: { line, index }, direction }
					: { start: { line, index }, end: mouseDownPosition, direction },
			);
		}
		setSelection({ start: { line, index }, end: { line, index }, direction: "ltr" });
	};

	const mouseIgnoreHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const mouseDownHandler = (index: number, line: number) => {
		setMouseDownPosition({ line, index });
	};

	const isCurrentLine = (index: number) =>
		selection.direction === "rtl" ? selection.start.line === index : selection.end.line === index;

	return (
		<div>
			<div
				ref={ref}
				className="outline-none w-full pb-96 cursor-text font-mono tracking-wide"
				onMouseDown={(e) => {
					e.preventDefault();

					mouseDownHandler(content[content.length - 1].length - 1, content.length - 1);
				}}
				onMouseUp={(e) => {
					e.preventDefault();

					mouseUpHandler(content[content.length - 1].length - 1, content.length - 1);
				}}
				onMouseOver={(e) => {
					if (e.buttons === 1) {
						e.preventDefault();

						mouseUpHandler(content[content.length - 1].length - 1, content.length - 1);
					}
				}}
			>
				{content &&
					content.map((line, lineIndex) => (
						<Line
							key={`line-${lineIndex}`}
							isCurrentLine={isCurrentLine(lineIndex)}
							mouseUpHandler={mouseUpHandler}
							mouseDownHandler={mouseDownHandler}
							mouseIgnoreHandler={mouseIgnoreHandler}
							selection={selection}
							line={line}
							lineIndex={lineIndex}
						/>
					))}
			</div>
		</div>
	);
};
