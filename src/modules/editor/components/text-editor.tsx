import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { LineNumber } from "./line-number";

export const TextEditor = React.memo(
	() => {
		const { tab } = useCurrentTab();
		const [lines, setLines] = React.useState<string[]>([]);
		const [caretPositions, setCaretPositions] = React.useState([
			{
				start: {
					line: 0,
					character: 0,
				},
				end: {
					line: 0,
					character: 0,
				},
				direction: "ltr",
			},
		]);

		const updateCaretPosition = React.useCallback(
			(index: number, position: any) => {
				const caretPositionsCopy = [...caretPositions];
				caretPositionsCopy[index] = position;
				setCaretPositions(caretPositionsCopy);
			},
			[caretPositions],
		);

		React.useEffect(() => {
			if (tab && tab.raw != null) {
				setLines(tab.raw.split("\n").map((line) => line.concat(" ")));
			}
		}, [tab, tab?.path]);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent) => {
				const linesCopy = [...lines];
				const currentLine = linesCopy[caretPositions[0].start.line];

				const newLine =
					currentLine.slice(0, caretPositions[0].start.character) +
					e.key +
					currentLine.slice(caretPositions[0].start.character);

				linesCopy[caretPositions[0].start.line] = newLine;

				updateCaretPosition(0, {
					start: { line: caretPositions[0].start.line, character: caretPositions[0].start.character + 1 },
					end: { line: caretPositions[0].start.line, character: caretPositions[0].start.character + 1 },
					direction: "ltr",
				});

				setLines(linesCopy);
			},
			[lines, tab?.path, caretPositions],
		);

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown as any);

			return () => {
				window.removeEventListener("keydown", handleKeyDown as any);
			};
		}, [handleKeyDown]);

		return (
			tab && (
				<div className="h-full">
					<Breadcrumbs />
					{/* <Scrollbars autoHide={true}> */}
					<div
						className="outline-none select-none cursor-text min-h-full pb-96"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							updateCaretPosition(0, {
								start: { line: lines.length - 1, character: lines[lines.length - 1].length - 1 },
								end: { line: lines.length - 1, character: lines[lines.length - 1].length - 1 },
								direction: "ltr",
							});
						}}
					>
						{lines.map((line, index) => (
							<Line
								key={`${line}-${index}`}
								index={index}
								line={line}
								caretPositions={caretPositions}
								updateCaretPosition={updateCaretPosition}
							/>
						))}
					</div>
					{/* </Scrollbars> */}
				</div>
			)
		);
	},
	() => true,
);

const Line = React.memo(
	({ index, line, caretPositions, updateCaretPosition }: any) => {
		const ref = React.useRef<HTMLDivElement>(null);

		return (
			<div className="flex items-center">
				<LineNumber number={index + 1} />
				<div
					ref={ref}
					className="px-2 w-full"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						updateCaretPosition(0, {
							start: { line: index, character: line.length - 1 },
							end: { line: index, character: line.length - 1 },
							direction: "ltr",
						});
					}}
				>
					{line.split("").map((char: any, charIndex: number) =>
						index === caretPositions[0].start.line && charIndex === caretPositions[0].start.character ? (
							<span key={`${index}-${charIndex}`}>
								<Caret />
								<Char lineIndex={index} charIndex={charIndex} char={char} updateCaretPosition={updateCaretPosition} />
							</span>
						) : (
							<Char
								key={`${index}-${charIndex}`}
								lineIndex={index}
								charIndex={charIndex}
								char={char}
								updateCaretPosition={updateCaretPosition}
							/>
						),
					)}
				</div>
			</div>
		);
	},
	() => true,
);

export const Char: React.FC<any> = React.memo(
	({ char, lineIndex, charIndex, updateCaretPosition }: any): any => {
		return (
			<span
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					updateCaretPosition(0, {
						start: { line: lineIndex, character: charIndex },
						end: { line: lineIndex, character: charIndex },
						direction: "ltr",
					});
				}}
			>
				{char}
			</span>
		);
	},
	() => true,
);

export const Caret = React.memo(
	() => {
		return <span className="caret"></span>;
	},
	() => true,
);
