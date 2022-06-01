import React from "react";
import { useAppSelector } from "@core/state/store";
import { Either } from "or-else";
import { Graph } from ".";
import { NoOp } from "@utils/no-op";
import { NodeWithChars } from "@core/parser/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";
import { OrdoFolder } from "@modules/file-explorer/types";
import { id } from "@utils/functions";

type GraphComponentProps = {
	token: NodeWithChars;
};

export const GraphComponent = React.memo(
	({ token }: GraphComponentProps) => {
		const tree = useAppSelector((state) => state.fileExplorer.tree);
		const [content, setContent] = React.useState<OrdoFolder | null>(null);

		const [showTags, setShowTags] = React.useState<boolean>(true);
		const [showFolders, setShowFolders] = React.useState<boolean>(true);
		const [showLinks, setShowLinks] = React.useState<boolean>(true);
		const [height, setHeight] = React.useState<string>("40vh");
		const [width, setWidth] = React.useState<string>("50vw");

		React.useEffect(() => {
			const parsed: string[] = token.data.parsed as string[];

			Either.fromNullable(tree)
				.chain((t) =>
					Either.fromNullable(parsed.find((attr) => attr.startsWith("folder=")))
						.map((attr) => attr.slice(8, -1))
						.chain((folder) => Either.fromNullable(findOrdoFolder(t, "readableName", folder))),
				)
				.fold(id, (c) => setContent(c));

			Either.fromNullable(parsed.find((attr) => attr === "no-folders")).fold(
				() => setShowFolders(true),
				() => setShowFolders(false),
			);

			Either.fromNullable(parsed.find((attr) => attr === "no-tags")).fold(
				() => setShowTags(true),
				() => setShowTags(false),
			);

			Either.fromNullable(parsed.find((attr) => attr.startsWith("height=")))
				.map((attr) => attr.slice(8, -1))
				.fold(
					() => setHeight("40vh"),
					(v) => setHeight(v),
				);

			Either.fromNullable(parsed.find((attr) => attr.startsWith("width=")))
				.map((attr) => attr.slice(7, -1))
				.fold(
					() => setWidth("50vw"),
					(v) => setWidth(v),
				);

			Either.fromNullable(parsed.find((attr) => attr === "no-links")).fold(
				() => setShowLinks(true),
				() => setShowLinks(false),
			);
		}, [tree.children.length]);

		return Either.fromNullable(content).fold(NoOp, (t) => (
			<div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-lg mb-4" style={{ width }}>
				<Graph tree={t} showFolders={showFolders} showLinks={showLinks} showTags={showTags} height={height} />
			</div>
		));
	},
	() => true,
);
