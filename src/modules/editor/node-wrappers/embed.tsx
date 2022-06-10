import { useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { EmbedNode } from "@modules/text-parser/types";
import { Switch } from "or-else";
import React from "react";

type Config = {
	isCurrentLine: boolean;
	node: EmbedNode;
};

// TODO: Render component
export const EmbedWrapper =
	({ isCurrentLine, node }: Config): React.FC =>
	({ children }) => {
		const tree = useAppSelector((state) => state.fileExplorer.tree);

		const getMarkup = Switch.of(node.data.contentType)
			.case("youtube", () => {
				const id = node.data.href.includes("youtu.be")
					? node.data.href.split("?")[0].split("/").reverse()[0]
					: node.data.href.split("?v=")[1];

				const src = `https://www.youtube.com/embed/${id}`;

				return (
					<div>
						<span className="text-xs text-neutral-500">{node.data.href}</span>
						<iframe name="google-disable-x-frame-options" width="640" height="360" src={src} frameBorder={0} />
					</div>
				);
			})
			.case("image", () => {
				const file = findOrdoFile(tree, "readableName", node.data.href);

				// TODO: Rendering images
				return file ? (
					<div>
						<span className="text-xs text-neutral-500">{children}</span>
					</div>
				) : (
					<span className="text-xs text-red-500">{children}</span>
				);
			})
			.default(() => <span className="text-xs text-neutral-500">{children}</span>);

		return isCurrentLine ? <span className="text-xs text-neutral-500">{children}</span> : getMarkup();
	};
