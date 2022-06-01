import React from "react";
import { Either } from "or-else";

import { useAppSelector } from "@core/state/store";
import { NodeWithChars } from "@core/parser/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";
import { OrdoFolder } from "@modules/file-explorer/types";
import { Graph } from "@modules/graph";
import { id } from "@utils/functions";
import { NoOp } from "@utils/no-op";

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
		const [width, setWidth] = React.useState<string>("100%");
		const [showBackground, setShowBackground] = React.useState<boolean>(true);

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

			Either.fromNullable(parsed.find((attr) => attr === "no-background")).fold(
				() => setShowBackground(true),
				() => setShowBackground(false),
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
					() => setWidth("100%"),
					(v) => setWidth(v),
				);

			Either.fromNullable(parsed.find((attr) => attr === "no-links")).fold(
				() => setShowLinks(true),
				() => setShowLinks(false),
			);
		}, [tree.children.length]);

		return Either.fromNullable(content).fold(NoOp, (t) => (
			<div
				className={`mb-4 ${showBackground && "rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-lg"}`}
				style={{ width }}
			>
				<Graph tree={t} showFolders={showFolders} showLinks={showLinks} showTags={showTags} height={height} />
			</div>
		));
	},
	() => true,
);
