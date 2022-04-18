import React from "react";
<<<<<<< HEAD
import { useAppSelector } from "@core/store-hooks";

import { Selection, SelectionBoundary } from "@modules/application/types";
import { Frontmatter } from "@modules/editor/frontmatter";

export interface CaretPosition {
	line: number;
	index: number;
}

export interface ChangeSelection {
	start: CaretPosition;
	end: CaretPosition;
	direction: "ltr" | "rtl";
}

export interface ChangeKeys {
	key: string;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
}

export interface Change {
	selection: ChangeSelection;
	keys?: ChangeKeys;
}

export interface ChangeResponse extends Change {
	content: string[];
}

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

export const Char = React.memo<{
	value: string;
	lineIndex: number;
	charIndex: number;
	mouseUpHandler: (charIndex: number, lineIndex: number) => void;
	mouseDownHandler: (charIndex: number, lineIndex: number) => void;
	selection: ChangeSelection;
}>(({ value, charIndex, lineIndex, mouseUpHandler, mouseDownHandler, selection }) => {
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

	const onMouseOver = (e: React.MouseEvent<HTMLSpanElement>) => {
		if (e.buttons === 1) {
			onMouseUp(e);
		}
	};

	const isInSelection = checkIsInSelection(selection, charIndex, lineIndex);

	let className = "";

	if (selectionExists(selection) && isInSelection) {
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
			className={`text-gray-900 ${className}`}
			data-index={`line-${lineIndex}-${charIndex}`}
			id={`line-${lineIndex}-${charIndex}`}
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
			onMouseOver={onMouseOver}
		>
			{value}
		</span>
	);
});

export const Line = React.memo<{
	line: string[];
	lineIndex: number;
	mouseIgnoreHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
	mouseDownHandler: (line: number, index: number) => void;
	mouseUpHandler: (line: number, index: number) => void;
	isCurrentLine: boolean;
	selection: Selection;
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

const IGNORED_KEY_PRESSES = ["Meta", "Control", "Alt", "Shift", "CapsLock"];

export const TextEditor: React.FC = () => {
	const tabs = useAppSelector((state) => state.application.openFiles);
	const currentTab = useAppSelector((state) => state.application.currentFile);
	const focused = useAppSelector((state) => state.application.focusedComponent);

	const ref = React.useRef<HTMLDivElement>(null);

	const [mouseDownPosition, setMouseDownPosition] = React.useState<SelectionBoundary | null>(null);

	React.useEffect(() => {
		if (!tabs.length || !tabs[currentTab] || !ref.current) {
			return;
		}

		window.addEventListener("keydown", onKeyDown);

		const node =
			tabs[currentTab].selection.direction === "rtl"
				? document.getElementById(`line-${tabs[currentTab].selection.start.line}-${tabs[currentTab].selection.start.index}`)
				: document.getElementById(`line-${tabs[currentTab].selection.end.line}-${tabs[currentTab].selection.end.index}`);

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
		if (focused !== "editor") {
			return;
		}

		e.preventDefault();

		const { key, metaKey, altKey, ctrlKey, shiftKey } = e;

		if (IGNORED_KEY_PRESSES.includes(key)) {
			return;
		}

		window.ordo.emit("@editor/on-key-down", { key, metaKey, altKey, ctrlKey, shiftKey });
	};

	const mouseUpHandler = React.useCallback(
		(index: number, line: number) => {
			window.ordo.emit("@application/set-focused-component", "editor");

			if (mouseDownPosition && (mouseDownPosition.index !== index || mouseDownPosition.line !== line)) {
				const isMouseDownBefore =
					mouseDownPosition.line < line || (mouseDownPosition.line === line && mouseDownPosition.index < index);
				const direction = isMouseDownBefore ? "ltr" : "rtl";
				window.ordo.emit(
					"@editor/on-mouse-up",
					isMouseDownBefore
						? { start: mouseDownPosition, end: { line, index }, direction }
						: { start: { line, index }, end: mouseDownPosition, direction },
				);
				return;
			}
			window.ordo.emit("@editor/on-mouse-up", { start: { line, index }, end: { line, index }, direction: "ltr" });
		},
		[mouseDownPosition],
	);

	const mouseIgnoreHandler = React.useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const mouseDownHandler = React.useCallback((index: number, line: number) => {
		setMouseDownPosition({ line, index });
	}, []);

	const isCurrentLine = (index: number) =>
		tabs[currentTab].selection.direction === "rtl"
			? tabs[currentTab].selection.start.line === index
			: tabs[currentTab].selection.end.line === index;

	return (
		<div>
			<Frontmatter />
			<div
				ref={ref}
				className="outline-none min-h-screen w-full cursor-text tracking-wide pb-96"
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
=======
import { Switch } from "or-else";
import Scrollbars from "react-custom-scrollbars";

import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { MdLine, MdToken } from "@utils/md-parser";
import { Breadcrumbs } from "./breadcrumbs";
import { openTab, parseMarkdown, setRange } from "./editor-slice";
import { useCurrentTab } from "./hooks";
import { findOrdoFileBy } from "@modules/file-explorer/file-tree/find-ordo-file-by";
import { createFile } from "@modules/file-explorer/file-explorer-slice";

const Wrapper = (line: MdLine) =>
	Switch.of(line)
		.case(
			(x) => x.type === "thematicBreak",
			() => <hr className="border-2 border-gray-400" />,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 1,
			({ children }: any) => <h1 className="text-4xl">{children}</h1>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 2,
			({ children }: any) => <h2 className="text-3xl">{children}</h2>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 3,
			({ children }: any) => <h3 className="text-2xl">{children}</h3>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 4,
			({ children }: any) => <h4 className="text-xl">{children}</h4>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 5,
			({ children }: any) => <h5 className="text-lg">{children}</h5>,
		)
		.case(
			(x) => x.type === "listItem",
			({ children }: any) => <li>{children}</li>,
		)
		.case(
			(x) => x.type === "blockquote",
			({ children }: any) => <blockquote className="pl-2 border-l-4 border-gray-500">{children}</blockquote>,
		)
		.case(
			(x) => x.type === "br",
			() => <br />,
		)
		.default(({ children }: any) => <div>{children}</div>);

const TokenWrapper = (tokenType: string, value?: string) =>
	Switch.of(tokenType)
		.case("delete", ({ children }: any) => <span className="line-through">{children}</span>)
		.case("emphasis", ({ children }: any) => <em className="italic">{children}</em>)
		.case("wikiLink", ({ children }: any) => {
			const dispatch = useAppDispatch();
			const tree = useAppSelector((state) => state.fileExplorer.tree);

			const [node, setNode] = React.useState<any>();

			if (!tree || !value) {
				return null;
			}

			React.useEffect(() => {
				setNode(findOrdoFileBy(tree, "relativePath", `./${value.includes(".") ? value : `${value}.md`}`));
			});

			const color = node ? "text-pink-600" : "text-gray-600";

			return (
				<a
					href="#"
					className={`underline ${color}`}
					onClick={async () => {
						if (!node) {
							const action = await dispatch(createFile({ tree, path: `${value.includes(".") ? value : `${value}.md`}` }));
							setNode(
								findOrdoFileBy(action.payload as any, "relativePath", `./${value.includes(".") ? value : `${value}.md`}`),
							);
						}

						dispatch(openTab((node as any).path));
					}}
				>
					{children}
				</a>
			);
		})
		.case("wikiLinkEmbed", ({ children }: any) => <span className="text-pink-500 text-xs">{children}</span>)
		.case("inlineCode", ({ children }: any) => (
			<code className="bg-rose-200 text-sm text-rose-700 rounded-lg px-2 py-0.5 font-mono">{children}</code>
		))
		.case("strong", ({ children }: any) => <strong className="font-bold">{children}</strong>)
		.default(({ children }: any) => <span>{children}</span>);

const Char: React.FC<{ index: number; tokenId: string; offset: number }> = ({ children, tokenId, index, offset }) => {
	const dispatch = useAppDispatch();
	const { tab } = useCurrentTab();
	const [lineNumber, ...tokenNesting] = tokenId.split("-").map(Number);
	const tokenNumber = tokenNesting.reduce((acc, v) => acc + v, 0);
	const charNumber = offset - tokenNumber + index;
	console.log(offset, tokenId);

	const range = tab?.ranges?.find((r) =>
		r.direction === "ltr"
			? r.end.line === lineNumber + 1 && r.end.character === charNumber
			: r.start.line === lineNumber + 1 && r.start.character === charNumber,
	);

	const className = range ? "caret" : "";

	return (
		<span
			className={className}
			onClick={() =>
				dispatch(
					setRange({
						start: {
							line: lineNumber + 1,
							character: charNumber,
						},
						end: {
							line: lineNumber + 1,
							character: charNumber,
						},
						direction: "ltr",
					}),
				)
			}
		>
			{children}
		</span>
	);
};

const Token: React.FC<{ token: MdToken }> = ({ token }) => {
	const Component = TokenWrapper(token.type, token.value);

	return (
		<Component>
			{token.children
				? token.children.map((child) => <Token key={child.id} token={child} />)
				: token.value?.split("").map((char, index) => (
						<Char key={`${token.id}-${index}`} index={index} tokenId={token.id} offset={(token as any).position.start.offset}>
							{char}
						</Char>
				  ))}
		</Component>
	);
};

const Line: React.FC<{ line: MdLine }> = ({ line }) => {
	const { tab } = useCurrentTab();
	const ranges = tab?.ranges;
	const currentLine =
		ranges &&
		ranges.find((range) => (range.direction === "ltr" ? range.end.line === line.number : range.end.line === line.number));
	const bgColor = currentLine ? "bg-gray-200" : "";

	if (line.type === "list" && !line.ordered) {
		return (
			<ul className={`list-disc list-inside ${bgColor}`}>
				{line.children?.map((child) => (
					<Line key={child.id} line={child as any} />
				))}
			</ul>
		);
	}

	if (line.type === "list" && line.ordered) {
		return (
			<ol className="list-decimal list-inside">
				{line.children?.map((child) => (
					<Line key={child.id} line={child as any} />
				))}
			</ol>
		);
	}

	const LineWrapper = Wrapper(line);

	return (
		<div className={`flex items-center whitespace-nowrap ${bgColor}`}>
			<div
				contentEditable={false}
				className="w-12 py-1 select-none self-stretch flex items-center flex-shrink-0 justify-end border-r border-neutral-200 dark:border-neutral-600 text-right pr-2 font-mono text-neutral-500 dark:text-neutral-400 text-sm"
			>
				{line.number ?? " "}
			</div>
			<div className={` px-2 w-full`}>
				{line.type === "thematicBreak" ? (
					<hr />
				) : (
					line.children && (
						<LineWrapper>
							{line.children.map((token: any) => (
								<Token key={token.id} token={token} />
							))}
						</LineWrapper>
					)
				)}
			</div>
		</div>
	);
};

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();

	const { tab } = useCurrentTab();

	React.useEffect(() => {
		if (tab && !tab.data) {
			dispatch(parseMarkdown(tab));
		}
	}, [tab && tab.data, tab?.data]);

	return (
		tab && (
			<>
				<div className="w-full text-sm text-gray-500">
					<Breadcrumbs />
				</div>
				<Scrollbars>
					<div className="cursor-text pb-[100%] leading-7 tracking-wide">
						{tab.data && tab.data.children.map((line: any) => <Line key={line.id} line={line} />)}
					</div>
				</Scrollbars>
			</>
		)
>>>>>>> ordo-app/main
	);
};
