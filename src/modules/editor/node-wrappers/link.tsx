import React from "react";
import { HiOutlineLink } from "react-icons/hi";

import { LinkNode } from "@modules/text-parser/types";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { OrdoFolder } from "@modules/file-explorer/types";

type Config = {
	dispatch: (key: any) => void;
	isCurrentLine: boolean;
	node: LinkNode;
	platform: string;
	tree: OrdoFolder;
};

export const LinkWrapper =
	({ dispatch, isCurrentLine, node, platform, tree }: Config): React.FC =>
	({ children }) => {
		const file = findOrdoFile(tree, "readableName", node.data.href);

		return isCurrentLine ? (
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

						if (node.data.contentType === "external") {
							dispatch({ type: "@editor/open-external-link", payload: node.data.href });
						} else if (file) {
							dispatch({ type: "@editor/open-tab", payload: file.path });
						} else {
							dispatch({ type: "@file-explorer/create-file", payload: node.data.href });
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

							if (node.data.contentType === "external") {
								dispatch({ type: "@editor/open-external-link", payload: node.data.href });
							} else if (file) {
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

						if (node.data.contentType === "external") {
							dispatch({ type: "@editor/open-external-link", payload: node.data.href });
						} else if (file) {
							dispatch({ type: "@editor/open-tab", payload: file.path });
						} else {
							dispatch({ type: "@file-explorer/create-file", payload: node.data!.href as string });
						}
					}}
				/>
			</div>
		);
	};
