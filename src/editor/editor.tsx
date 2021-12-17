import type { CaretPosition, ChangeResponse, ChangeSelection } from "./types";

import React from "react";

import "./editor.css";

const statusLine = (selection: ChangeSelection) => {
	const line = `Ln ${selection.start.line}, Col ${selection.start.index}`;

	return line;
};

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

		ref.current && ref.current.classList.add("caret");

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

export const Editor: React.FC<any> = ({ addStatus, updateStatus, removeStatus }) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [content, setContent] = React.useState<string[]>(null);
	const [selection, setSelection] = React.useState<ChangeSelection>({
		start: {
			line: 0,
			index: 0,
		},
	});

	const charClickHandler = (index: number, line: number) => {
		setSelection({ start: { line, index } });
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

		const node = document.getElementById(`line-${selection.start.line}-${selection.start.index}`);

		node && node.classList.add("caret");
		updateStatus({ id: "EDITOR_CARET_POSITION", value: statusLine(selection) });

		return () => {
			node && node.classList.remove("caret");
		};
	}, [selection.start.index, selection.start.line]);

	React.useEffect(() => {
		window.Editor.getContent().then(setContent);
		addStatus({ id: "EDITOR_CARET_POSITION", value: statusLine(selection) });

		return () => {
			setContent(null);
			removeStatus("EDITOR_CARET_POSITION");
		};
	}, []);

	React.useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selection.start.index, selection.start.line]);

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

					setSelection({
						start: {
							line: content.length - 1,
							index: content[content.length - 1].length - 1,
						},
					});
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
							>
								{lineIndex + 1}
							</div>
							<div
								data-index={`line-${lineIndex}`}
								style={{ width: "100%", tabSize: "1em", cursor: "text", padding: "0 0.5em", fontFamily: "monospace" }}
								onMouseUp={(e) => {
									e.preventDefault();
									e.stopPropagation();

									setSelection({
										start: {
											line: lineIndex,
											index: line.length - 1,
										},
									});
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
