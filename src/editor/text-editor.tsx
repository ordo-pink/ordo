import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Line } from "./line";
import { CaretPosition } from "./types";
import { onKeyDown as editorOnKeyDown } from "../redux/store";

const IGNORED_KEY_PRESSES = ["Meta", "Control", "Alt", "Shift", "CapsLock"];

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();

	const tabs = useAppSelector((state) => state.tabs);
	const currentTab = useAppSelector((state) => state.currentTab);

	const ref = React.useRef<HTMLDivElement>(null);

	const [mouseDownPosition, setMouseDownPosition] = React.useState<CaretPosition>(null);

	React.useEffect(() => {
		if (!tabs.length || currentTab == null || !tabs[currentTab] || !ref.current) {
			return;
		}

		window.addEventListener("keydown", onKeyDown);

		const node =
			tabs[currentTab].selection.direction === "rtl"
				? document.getElementById(
						`line-${tabs[currentTab].selection.start.line}-${tabs[currentTab].selection.start.index}`,
				  )
				: document.getElementById(
						`line-${tabs[currentTab].selection.end.line}-${tabs[currentTab].selection.end.index}`,
				  );

		node && node.classList.add("caret");

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			node && node.classList.remove("caret");
		};
	}, [
		tabs[currentTab].selection.start.index,
		tabs[currentTab].selection.start.line,
		tabs[currentTab].selection.end.index,
		tabs[currentTab].selection.end.line,
		tabs[currentTab].selection.direction,
	]);

	const onKeyDown = (e: KeyboardEvent) => {
		const { key, metaKey, altKey, ctrlKey, shiftKey } = e;

		if (IGNORED_KEY_PRESSES.includes(key)) {
			return;
		}

		e.preventDefault();

		dispatch(
			editorOnKeyDown({ selection: tabs[currentTab].selection, keys: { key, metaKey, altKey, ctrlKey, shiftKey } }),
		);
	};

	const mouseUpHandler = (index: number, line: number) => {
		if (mouseDownPosition && (mouseDownPosition.index !== index || mouseDownPosition.line !== line)) {
			const isMouseDownBefore =
				mouseDownPosition.line < line || (mouseDownPosition.line === line && mouseDownPosition.index < index);
			const direction = isMouseDownBefore ? "ltr" : "rtl";

			dispatch(
				editorOnKeyDown({
					selection: isMouseDownBefore
						? { start: mouseDownPosition, end: { line, index }, direction }
						: { start: { line, index }, end: mouseDownPosition, direction },
				}),
			);

			return;
		}

		dispatch(editorOnKeyDown({ selection: { start: { line, index }, end: { line, index }, direction: "ltr" } }));
	};

	const mouseIgnoreHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const mouseDownHandler = (index: number, line: number) => {
		setMouseDownPosition({ line, index });
	};

	const isCurrentLine = (index: number) =>
		tabs[currentTab].selection.direction === "rtl"
			? tabs[currentTab].selection.start.line === index
			: tabs[currentTab].selection.end.line === index;

	return (
		<div>
			<div
				ref={ref}
				className="outline-none w-full pb-96 cursor-text font-mono tracking-wide"
				onMouseDown={(e) => {
					e.preventDefault();

					mouseDownHandler(
						tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
						tabs[currentTab].body.length - 1,
					);
				}}
				onMouseUp={(e) => {
					e.preventDefault();

					mouseUpHandler(
						tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
						tabs[currentTab].body.length - 1,
					);
				}}
				onMouseOver={(e) => {
					if (e.buttons === 1) {
						e.preventDefault();

						mouseUpHandler(
							tabs[currentTab].body[tabs[currentTab].body.length - 1].length - 1,
							tabs[currentTab].body.length - 1,
						);
					}
				}}
			>
				{tabs[currentTab].body &&
					tabs[currentTab].body.map((line, lineIndex) => (
						<Line
							key={`line-${lineIndex}`}
							isCurrentLine={isCurrentLine(lineIndex)}
							mouseUpHandler={mouseUpHandler}
							mouseDownHandler={mouseDownHandler}
							mouseIgnoreHandler={mouseIgnoreHandler}
							selection={tabs[currentTab].selection}
							line={line}
							lineIndex={lineIndex}
						/>
					))}
			</div>
		</div>
	);
};
