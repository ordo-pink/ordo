import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { LineNumber } from "./line-number";
import { handleTyping, openTab, updateCaretPositions, useEditorDispatch, useEditorSelector } from "../state";

export const TextEditor: React.FC = () => {
	return (
		<div className="h-full">
			<Breadcrumbs />
			<Scrollbars autoHide onUpdate={() => {}}>
				<Lines />
			</Scrollbars>
		</div>
	);
};

const Lines = React.memo(
	() => {
		const dispatch = useEditorDispatch();
		const { tab } = useCurrentTab();
		const tabs = useEditorSelector((state) => state.editor.tabs);

		React.useEffect(() => {
			if (tab) {
				dispatch(openTab(tab));
			}
		}, [tab]);

		const handleKeyDown = ({ key, altKey, shiftKey, ctrlKey, metaKey }: React.KeyboardEvent) => {
			tab &&
				dispatch(
					handleTyping({ path: tab.path, event: { key, shiftKey, altKey, ctrlKey, metaKey } as React.KeyboardEvent }),
				);
		};

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown as any);

			return () => {
				window.removeEventListener("keydown", handleKeyDown as any);
			};
		}, [tab]);

		if (!tab) return null;

		const currentTab = tabs.find((t) => t.path === tab.path);

		if (!currentTab || !currentTab.lines) return null;

		return (
			<div
				className="outline-none select-none cursor-text pb-[calc(50vh-9.5rem)]"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(
						updateCaretPositions({
							path: tab.path,
							positions: [
								{
									start: {
										line: currentTab.lines.length - 1,
										character: currentTab.lines[currentTab.lines.length - 1].length - 1,
									},
									end: {
										line: currentTab.lines.length - 1,
										character: currentTab.lines[currentTab.lines.length - 1].length - 1,
									},
									direction: "ltr",
								},
							],
						}),
					);
				}}
			>
				{currentTab.lines &&
					currentTab.lines.map((line, index) => <Line key={`${line}-${index}`} index={index} line={line} />)}
			</div>
		);
	},
	() => true,
);

const Line = ({ index, line }: any) => {
	const dispatch = useEditorDispatch();
	const { tab } = useCurrentTab();
	const tabs = useEditorSelector((state) => state.editor.tabs);
	const ref = React.useRef<HTMLDivElement>(null);

	if (!tab) return null;
	const currentTab = tabs.find((t) => t.path === tab.path);
	if (!currentTab) return null;

	return (
		<div className="flex items-center w-full">
			<LineNumber number={index + 1} />
			<div
				ref={ref}
				className="px-2 w-full leading-5 whitespace-pre tracking-wide"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(
						updateCaretPositions({
							path: tab.path,
							positions: [
								{
									start: { line: index, character: line.length - 1 },
									end: { line: index, character: line.length - 1 },
									direction: "ltr",
								},
							],
						}),
					);
				}}
			>
				{line.split("").map((char: any, charIndex: number) => (
					<Char key={`${index}-${charIndex}`} lineIndex={index} charIndex={charIndex} char={char} />
				))}
			</div>
		</div>
	);
};

export const Char: React.FC<any> = ({ char, lineIndex, charIndex }: any): any => {
	const dispatch = useEditorDispatch();
	const { tab } = useCurrentTab();
	const tabs = useEditorSelector((state) => state.editor.tabs);

	if (!tab) return null;
	const currentTab = tabs.find((t) => t.path === tab.path);
	if (!currentTab) return null;

	return (
		<>
			{lineIndex === currentTab.caretPositions[0].start.line &&
			charIndex === currentTab.caretPositions[0].start.character ? (
				<Caret />
			) : null}
			<span
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(
						updateCaretPositions({
							path: tab.path,
							positions: [
								{
									start: { line: lineIndex, character: charIndex },
									end: { line: lineIndex, character: charIndex },
									direction: "ltr",
								},
							],
						}),
					);
				}}
			>
				{char}
			</span>
		</>
	);
};

export const Caret = React.memo(
	() => {
		return <span className="caret"></span>;
	},
	() => true,
);
