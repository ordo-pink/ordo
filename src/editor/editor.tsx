import { CaretPosition, ChangeResponse, ChangeSelection } from "./types";

import React from "react";

import "./editor.css";

const getStatusLine = (selection: ChangeSelection) => {
	const line = selection.direction === "rtl" ? selection.start.line : selection.end.line;
	const index = selection.direction === "rtl" ? selection.start.index : selection.end.index;

	return JSON.stringify(selection);
	// return `Ln ${line}, Col ${index}`;
};

const selectionExists = (selection: ChangeSelection) =>
	selection.start.index !== selection.end.index || selection.start.line !== selection.end.line;

const checkIsInSelection = (selection: ChangeSelection, charIndex: number, lineIndex: number) => {
	const exists = selectionExists(selection);
	const betweenSelectedLines = exists && lineIndex > selection.start.line && lineIndex < selection.end.line;
	const onLastSelectedLine =
		exists &&
		selection.start.line !== selection.end.line &&
		lineIndex === selection.end.line &&
		charIndex < selection.end.index;
	const onFirstSelectedLine =
		exists &&
		selection.start.line !== selection.end.line &&
		lineIndex === selection.start.line &&
		charIndex >= selection.start.index;
	const onlyOneLineSelected =
		selection.start.index !== selection.end.index &&
		selection.start.line === selection.end.line &&
		lineIndex === selection.start.line &&
		charIndex >= selection.start.index &&
		charIndex < selection.end.index;

	return betweenSelectedLines || onLastSelectedLine || onFirstSelectedLine || onlyOneLineSelected;
};

const Char: React.FC<{
	value: string;
	lineIndex: number;
	charIndex: number;
	mouseUpHandler: (charIndex: number, lineIndex: number) => void;
	mouseDownHandler: (charIndex: number, lineIndex: number) => void;
	selection: ChangeSelection;
}> = ({ value, charIndex, lineIndex, mouseUpHandler, mouseDownHandler, selection }) => {
	const ref = React.useRef<HTMLSpanElement>(null);

	const onMouseUp = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		e.preventDefault();

		ref.current && ref.current.classList.add("caret");

		mouseUpHandler(charIndex, lineIndex);
	};

	const onMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		e.preventDefault();

		mouseDownHandler(charIndex, lineIndex);
	};

	const isInSelection = checkIsInSelection(selection, charIndex, lineIndex);

	let className = "";

	if (selectionExists && isInSelection) {
		className += "editor-selection ";
	}

	if (charIndex === selection.start.index && lineIndex === selection.start.line) {
		className += "selection-start ";
	}

	if (charIndex === selection.end.index - 1 && lineIndex === selection.end.line) {
		className += "selection-end ";
	}

	if (value === "\t") {
		className += "tab ";
	}

	if (value === " ") {
		className += "space ";
	}

	if (value === "\n") {
		className += "new-line ";
	}

	return (
		<span
			ref={ref}
			className={className}
			style={{
				display: "inline-block",
				whiteSpace: "pre",
			}}
			data-index={`line-${lineIndex}-${charIndex}`}
			id={`line-${lineIndex}-${charIndex}`}
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
			onMouseOver={(e) => {
				if (e.buttons === 1) {
					onMouseUp(e);
				}
			}}
		>
			{value}
		</span>
	);
};

const ignoredKeyPresses = ["Meta", "Control", "Alt", "Shift", "CapsLock"];

export const Editor: React.FC<any> = ({ addStatus, updateStatus, removeStatus }) => {
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
		updateStatus({ id: "EDITOR_CARET_POSITION", value: getStatusLine(selection) });

		return () => {
			node && node.classList.remove("caret");
		};
	}, [selection.start.index, selection.start.line, selection.end.index, selection.end.line]);

	React.useEffect(() => {
		window.Editor.getContent().then(setContent);
		addStatus({ id: "EDITOR_CARET_POSITION", value: getStatusLine(selection) });

		return () => {
			setContent(null);
			removeStatus("EDITOR_CARET_POSITION");
		};
	}, []);

	React.useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selection.start.index, selection.start.line, selection.end.index, selection.end.line]);

	return (
		<div>
			<div
				ref={ref}
				style={{
					fontSize: "16px",
					outline: "none",
					wordWrap: "break-word",
					width: "100%",
					lineBreak: "anywhere",
					paddingBottom: "calc(100vh - 6em)",
					cursor: "text",
				}}
				onMouseDown={(e) => {
					e.preventDefault();

					mouseDownHandler(content[content.length - 1].length - 1, content.length - 1);
				}}
				onMouseUp={(e) => {
					if (e.buttons === 1) {
						e.preventDefault();

						mouseUpHandler(content[content.length - 1].length - 1, content.length - 1);
					}
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
							style={{
								display: "flex",
								alignItems: "center",
								background: lineIndex === selection.start.line ? "#ddd" : "transparent",
								lineHeight: "1.5",
							}}
						>
							<div
								style={{
									width: "3em",
									flexShrink: 0,
									textAlign: "right",
									paddingRight: "0.5em",
									fontWeight: 900,
									color: lineIndex === selection.start.line ? "#000" : "#555",
									userSelect: "none",
									fontSize: "0.8em",
									cursor: "default",
								}}
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
								style={{ width: "100%", tabSize: "1em", cursor: "text", padding: "0 0.5em", fontFamily: "monospace" }}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();

									mouseDownHandler(line.length - 1, lineIndex);
								}}
								onMouseUp={(e) => {
									if (e.buttons === 1) {
										e.preventDefault();
										e.stopPropagation();

										mouseUpHandler(line.length - 1, lineIndex);
									}
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
