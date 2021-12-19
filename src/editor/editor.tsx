import { CaretPosition, ChangeResponse, ChangeSelection } from "./types";

import React from "react";

import "./editor.css";

import { useAppDispatch } from "../redux/hooks";
import { addStatusBarItem, updateStatusBarItem, removeStatusBarItem } from "../status-bar/state";

import { Char } from "./char";

const getStatusLine = (selection: ChangeSelection) => {
	const line = selection.direction === "rtl" ? selection.start.line : selection.end.line;
	const index = selection.direction === "rtl" ? selection.start.index : selection.end.index;

	return `Ln ${line}, Col ${index}`;
};

const ignoredKeyPresses = ["Meta", "Control", "Alt", "Shift", "CapsLock"];

export const Editor: React.FC = () => {
	const dispatch = useAppDispatch();

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

	const mouseDownHandler = (index: number, line: number) => {
		setMouseDownPosition({ line, index });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const { key, metaKey, altKey, ctrlKey, shiftKey } = e;

		if (ignoredKeyPresses.includes(key)) {
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

	React.useEffect(() => {
		if (!content || !ref.current || !selection) {
			return;
		}

		const node =
			selection.direction === "rtl"
				? document.getElementById(`line-${selection.start.line}-${selection.start.index}`)
				: document.getElementById(`line-${selection.end.line}-${selection.end.index}`);

		node && node.classList.add("caret");
		dispatch(updateStatusBarItem({ id: "EDITOR_CARET_POSITION", position: "right", value: getStatusLine(selection) }));

		return () => {
			node && node.classList.remove("caret");
		};
	}, [selection.start.index, selection.start.line, selection.end.index, selection.end.line]);

	React.useEffect(() => {
		window.Editor.getContent().then(setContent);
		dispatch(addStatusBarItem({ id: "EDITOR_CARET_POSITION", position: "right", value: getStatusLine(selection) }));

		return () => {
			setContent(null);
			dispatch(removeStatusBarItem({ id: "EDITOR_CARET_POSITION", position: "right" }));
		};
	}, []);

	React.useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selection.start.index, selection.start.line, selection.end.index, selection.end.line]);

	const isCurrentLine = (index: number) =>
		selection.direction === "rtl" ? selection.start.line === index : selection.end.line === index;

	return (
		<div>
			<div
				ref={ref}
				className="outline-none break-words w-full pb-96 cursor-text font-mono tracking-wide"
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
						<div
							key={`line-${lineIndex}`}
							className={`flex items-center ${isCurrentLine(lineIndex) ? "bg-gray-200" : ""}`}
						>
							<div
								className={` w-16 shrink-0 text-sm text-right pr-2 font-sans select-none cursor-default ${
									isCurrentLine(lineIndex) ? "texg-gray-500" : "text-gray-400"
								}`}
								onMouseUp={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onMouseOver={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
							>
								{lineIndex + 1}
							</div>
							<div
								data-index={`line-${lineIndex}`}
								className="w-full cursor-text px-2"
								style={{ tabSize: "2rem" }}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();

									mouseDownHandler(line.length - 1, lineIndex);
								}}
								onMouseUp={(e) => {
									e.preventDefault();
									e.stopPropagation();

									mouseUpHandler(line.length - 1, lineIndex);
								}}
								onMouseOver={(e) => {
									if (e.buttons === 1) {
										e.preventDefault();
										e.stopPropagation();

										mouseUpHandler(line.length - 1, lineIndex);
									}
								}}
							>
								{line.split("").map((char, charIndex) => (
									<Char
										key={`line-${lineIndex}-${charIndex}`}
										lineIndex={lineIndex}
										charIndex={charIndex}
										value={char}
										selection={selection}
										mouseUpHandler={mouseUpHandler}
										mouseDownHandler={mouseDownHandler}
									/>
								))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};
