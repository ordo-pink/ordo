import React from "react";
import { ChangeSelection } from "./types";

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

export const Char: React.FC<{
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
		className += "editor-selection bg-pink-200 ";
	}

	if (value === "\t") {
		className += "tab text-pink-400 ";
	}

	if (value === " ") {
		className += "space text-pink-400 ";
	}

	if (value === "\n") {
		className += "new-line ";
	}

	return (
		<span
			ref={ref}
			style={{
				display: "inline-block",
				whiteSpace: "pre",
			}}
			className={className}
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
