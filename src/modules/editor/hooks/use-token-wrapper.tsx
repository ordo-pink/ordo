import React from "react";

import { Node } from "@core/parser/types";
import { TextNodeWithChildrenType, TextNodeWithCharsType } from "@modules/text-parser/enums";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { HiOutlineLink } from "react-icons/hi";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const useTokenWrapper = (token?: Node, isCurrentLine = false) => {
	const dispatch = useAppDispatch();
	const platform = useAppSelector((state) => state.app.internalSettings.platform);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const file = React.useMemo(
		() => (token?.data!.href ? findOrdoFile(tree, "readableName", token!.data!.href as string) : null),
		[token?.data!.href, tree],
	);

	const wrapper: React.FC = React.useMemo(() => {
		if (token?.type === TextNodeWithChildrenType.HEADING) {
			if (token.depth === 1) return ({ children }) => <h1 className="inline text-4xl">{children}</h1>;
			if (token.depth === 2) return ({ children }) => <h2 className="inline text-3xl">{children}</h2>;
			if (token.depth === 3) return ({ children }) => <h3 className="inline text-2xl">{children}</h3>;
			if (token.depth === 4) return ({ children }) => <h4 className="inline text-xl">{children}</h4>;
			return ({ children }) => <h5 className="inline text-lg">{children}</h5>;
		}

		if (token?.type === TextNodeWithChildrenType.TODO) {
			return ({ children }) =>
				isCurrentLine ? (
					<span>{children}</span>
				) : (
					<div className="flex space-x-2 items-center">
						<input
							type="checkbox"
							className="block w-5 h-5 text-green-700"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onChange={() => dispatch({ type: "@editor/toggle-todo", payload: token.range.start.line - 1 })}
							checked={(token.data! as { checked: boolean }).checked}
						/>
						<div className={(token.data! as { checked: boolean }).checked ? "line-through" : ""}>{children}</div>
					</div>
				);
		}

		if (token?.type === TextNodeWithCharsType.COMPONENT) {
			// TODO: Render component
			return ({ children }) => {
				return <span className="text-xs text-neutral-500">{children}</span>;
			};
		}

		if (token?.type === TextNodeWithCharsType.EMBED) {
			// TODO: Render component
			return ({ children }) =>
				isCurrentLine ? (
					<span className="text-xs text-neutral-500">{children}</span>
				) : (
					<div>
						<span className="text-xs text-neutral-500">{children}</span>
					</div>
				);
		}

		if (token?.type === TextNodeWithCharsType.HR) {
			return ({ children }) => (isCurrentLine ? <span>{children}</span> : <hr />);
		}

		if (token?.type === TextNodeWithCharsType.TAG) {
			return ({ children }) => (
				<strong className="bg-gradient-to-tr from-orange-600 dark:from-purple-400 to-pink-700 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-xl mt-2">
					{children}
				</strong>
			);
		}

		if (token?.type === TextNodeWithChildrenType.BOLD) {
			return ({ children }) => <strong className="font-bold">{children}</strong>;
		}

		if (token?.type === TextNodeWithChildrenType.ITALIC) {
			return ({ children }) => <em className="italic">{children}</em>;
		}

		if (token?.type === TextNodeWithCharsType.LINK) {
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
									dispatch({ type: "@file-explorer/create-file", payload: token.data!.href as string });
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
										dispatch({ type: "@file-explorer/create-file", payload: token.data!.href as string });
									}
								}
							}}
							title={`${platform === "darwin" ? "Cmd" : "Ctrl"}+Click to follow the link.`}
						>
							{token.data!.href as string}
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
									dispatch({ type: "@file-explorer/create-file", payload: token.data!.href as string });
								}
							}}
						/>
					</div>
				);
		}

		if (token?.type === TextNodeWithChildrenType.CODE) {
			return ({ children }) => (
				<code className="px-2 py-0.5 rounded-lg bg-neutral-300 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
					{children}
				</code>
			);
		}

		if (token?.type === TextNodeWithChildrenType.STRIKETHROUGH) {
			return ({ children }) => <span className="line-through">{children}</span>;
		}

		return ({ children }) => <span>{children}</span>;
	}, [
		token && token.type,
		token && token.depth,
		isCurrentLine,
		token && token.data && (token.data as any).checked,
		file,
	]);

	return wrapper;
};
