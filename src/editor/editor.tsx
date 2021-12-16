import type { ChangeResponse } from "./types";

import React from "react";

import "./editor.css";

const Char: React.FC<{
	value: string;
	lineIndex: number;
	charIndex: number;
	charClickHandler: (charIndex: number, lineIndex: number) => void;
}> = ({ value, charIndex, lineIndex, charClickHandler }) => {
	const ref = React.useRef<HTMLSpanElement>(null);

	const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		e.preventDefault();

		ref.current.classList.add("caret");

		charClickHandler(charIndex, lineIndex);
	};

	return (
		<span
			style={{ display: "inline-block", whiteSpace: "pre" }}
			ref={ref}
			data-index={`line-${lineIndex}-${charIndex}`}
			id={`line-${lineIndex}-${charIndex}`}
			onMouseUp={onClick}
		>
			{value}
		</span>
	);
};

const ignoredKeyPresses = ["Meta", "Control", "Alt", "Shift", "CapsLock"];

export const Editor: React.FC = () => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [content, setContent] = React.useState<string[]>(null);
	const [caretStart, setCaretStart] = React.useState<number>(0);
	const [currentLine, setCurrentLine] = React.useState<number>(0);

	const charClickHandler = (charIndex: number, lineIndex: number) => {
		setCaretStart(charIndex);
		setCurrentLine(lineIndex);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const { key, metaKey, altKey, ctrlKey, shiftKey } = e;

		if (ignoredKeyPresses.includes(key)) {
			return;
		}

		e.preventDefault();

		window.Editor.onKeyDown({
			selection: { start: caretStart, line: currentLine, length: 0 },
			keys: { key, metaKey, altKey, ctrlKey, shiftKey },
		}).then(({ selection, content }: ChangeResponse) => {
			setContent(content);
			setCaretStart(selection.start);
			setCurrentLine(selection.line);
		});
	};

	React.useEffect(() => {
		if (!content || !ref.current) {
			return;
		}

		const node = document.getElementById(`line-${currentLine}-${caretStart}`);

		node && node.classList.add("caret");

		return () => {
			node && node.classList.remove("caret");
		};
	}, [caretStart, currentLine]);

	React.useEffect(() => {
		window.Editor.getContent().then(setContent);

		return () => {
			setContent(null);
		};
	}, []);

	React.useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [caretStart, currentLine]);

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
				onMouseUp={(e) => {
					e.preventDefault();

					setCurrentLine(content.length - 1);
					setCaretStart(content[content.length - 1].length - 1);
				}}
			>
				{content &&
					content.map((line, lineIndex) => (
						<div
							key={`line-${lineIndex}`}
							style={{
								display: "flex",
								alignItems: "center",
								background: lineIndex === currentLine ? "#ddd" : "transparent",
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
									color: lineIndex === currentLine ? "#000" : "#555",
									userSelect: "none",
									fontSize: "0.8em",
									cursor: "default",
								}}
								onMouseUp={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
							>
								{lineIndex + 1}
							</div>
							<div
								data-index={`line-${lineIndex}`}
								style={{ width: "100%", tabSize: "1em", cursor: "text", padding: "0 0.5em", fontFamily: "monospace" }}
								onMouseUp={(e) => {
									e.preventDefault();
									e.stopPropagation();

									setCurrentLine(lineIndex);
									setCaretStart(line.length - 1);
								}}
							>
								{line.split("").map((char, charIndex) => (
									<Char
										key={`line-${lineIndex}-${charIndex}`}
										lineIndex={lineIndex}
										charIndex={charIndex}
										value={char}
										charClickHandler={charClickHandler}
									/>
								))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};
