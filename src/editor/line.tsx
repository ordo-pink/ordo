import React from "react";
import { Char } from "./char";
import { ChangeSelection } from "./types";

export const Line = React.memo<{
	line: string[];
	lineIndex: number;
	mouseIgnoreHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
	mouseDownHandler: (line: number, index: number) => void;
	mouseUpHandler: (line: number, index: number) => void;
	isCurrentLine: boolean;
	selection: ChangeSelection;
}>(({ line, lineIndex, mouseIgnoreHandler, mouseDownHandler, mouseUpHandler, isCurrentLine, selection }) => {
	if (!line.length) {
		line = [" "];
	}

	return (
		<div className={`flex items-center ${isCurrentLine ? "bg-gray-200 dark:bg-gray-800 dark:bg-opacity-40" : ""}`}>
			<div
				className={` w-16 shrink-0 text-sm text-right pr-2 font-sans select-none cursor-default ${
					isCurrentLine ? "text-gray-500 dark:text-gray-100" : "text-gray-400"
				}`}
				onMouseUp={mouseIgnoreHandler}
				onMouseDown={mouseIgnoreHandler}
				onMouseOver={mouseIgnoreHandler}
			>
				{lineIndex + 1}
			</div>
			<div
				data-index={`line-${lineIndex}`}
				className="w-full cursor-text px-2 text-gray-800 dark:text-gray-200"
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
				{line.map((char, charIndex) => (
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
	);
});
