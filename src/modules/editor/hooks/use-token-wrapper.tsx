import React from "react";

import { Node, NodeWithChars } from "@core/parser/types";
import { TextNodeWithChildrenType, TextNodeWithCharsType } from "@modules/text-parser/enums";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { HiOutlineLink } from "react-icons/hi";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { HeadingWrapper } from "../node-wrappers/heading";
import { ToDoWrapper } from "../node-wrappers/todo";
import { isComponentNode, isEmbedNode, isHeadingNode, isToDoNode } from "@modules/text-parser/is";
import { ComponentWrapper } from "../node-wrappers/component";
import { EmbedWrapper } from "../node-wrappers/embed";
import { NoOp } from "@utils/no-op";

export const useTextNodeWrapper = (node?: Node, isCurrentLine = false): React.FC => {
	const dispatch = useAppDispatch();
	const platform = useAppSelector((state) => state.app.internalSettings.platform);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const file = React.useMemo(
		() => (node?.data!.href ? findOrdoFile(tree, "readableName", node!.data!.href as string) : null),
		[node?.data!.href, tree],
	);

	if (!node) return NoOp;

	const wrapper: React.FC = React.useMemo(() => {
		if (isHeadingNode(node)) {
			return HeadingWrapper(node.depth);
		}

		if (isToDoNode(node)) {
			return ToDoWrapper({
				node: node,
				isCurrentLine,
			});
		}

		if (isComponentNode(node)) {
			const component = node.raw.slice(1, node.raw.indexOf(" "));
			return ComponentWrapper({ isCurrentLine, component, node });
		}

		if (isEmbedNode(node)) {
			return EmbedWrapper({ isCurrentLine, node });
		}

		if (node?.type === TextNodeWithCharsType.HR) {
			return ({ children }) => (isCurrentLine ? <span>{children}</span> : <hr />);
		}

		if (node?.type === TextNodeWithCharsType.TAG) {
			return ({ children }) => (
				<strong className="bg-gradient-to-tr from-orange-600 dark:from-purple-400 to-pink-700 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-xl mt-2">
					{children}
				</strong>
			);
		}

		if (node?.type === TextNodeWithChildrenType.BOLD) {
			return ({ children }) => <strong className="font-bold">{children}</strong>;
		}

		if (node?.type === TextNodeWithChildrenType.ITALIC) {
			return ({ children }) => <em className="italic">{children}</em>;
		}

		if (node?.type === TextNodeWithCharsType.LINK) {
			return ({ children }) =>
				isCurrentLine ? (
					<span
						onMouseMove={(e) => {
							if (e.ctrlKey && !e.currentTarget.classList.contains("cursor-pointer")) {
								e.currentTarget.classList.add("cursor-pointer");
							}
						}}
						onMouseLeave={(e) => e.currentTarget.classList.remove("cursor-pointer")}
						onClick={(e) => {
							if (e.ctrlKey) {
								e.preventDefault();
								e.stopPropagation();

								if (file) {
									dispatch({ type: "@editor/open-tab", payload: file.path });
								} else {
									dispatch({ type: "@file-explorer/create-file", payload: node.data!.href as string });
								}
							}
						}}
						title={`${platform === "darwin" ? "Cmd" : "Ctrl"}+Click to follow the link.`}
						className={`hover:underline ${!file ? "text-sky-800 dark:text-sky-400" : "text-purple-800 dark:text-purple-400"}`}
					>
						{children}
					</span>
				) : (
					<div
						className={`inline-flex space-x-1 items-center underline ${
							!file ? "text-sky-800 dark:text-sky-400" : "text-purple-800 dark:text-purple-400"
						}`}
					>
						<div
							onMouseMove={(e) => {
								if (e.ctrlKey && !e.currentTarget.classList.contains("cursor-pointer")) {
									e.currentTarget.classList.add("cursor-pointer");
								}
							}}
							onMouseLeave={(e) => e.currentTarget.classList.remove("cursor-pointer")}
							onClick={(e) => {
								if (e.ctrlKey) {
									e.preventDefault();
									e.stopPropagation();

									if (file) {
										dispatch({ type: "@editor/open-tab", payload: file.path });
									} else {
										dispatch({ type: "@file-explorer/create-file", payload: node.data!.href as string });
									}
								}
							}}
							title={`${platform === "darwin" ? "Cmd" : "Ctrl"}+Click to follow the link.`}
						>
							{node.data!.href as string}
						</div>
						<HiOutlineLink
							title="Click here to follow the link."
							className="cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();

								if (file) {
									dispatch({ type: "@editor/open-tab", payload: file.path });
								} else {
									dispatch({ type: "@file-explorer/create-file", payload: node.data!.href as string });
								}
							}}
						/>
					</div>
				);
		}

		if (node?.type === TextNodeWithChildrenType.CODE) {
			return ({ children }) => (
				<code className="px-2 py-0.5 rounded-lg bg-neutral-300 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
					{children}
				</code>
			);
		}

		if (node?.type === TextNodeWithChildrenType.STRIKETHROUGH) {
			return ({ children }) => <span className="line-through">{children}</span>;
		}

		return ({ children }) => <span>{children}</span>;
	}, [node, isCurrentLine, file]);

	return wrapper;
};
