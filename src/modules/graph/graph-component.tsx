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

		React.useEffect(() => {
			Either.fromNullable(tree)
				.chain((t) =>
					Either.try(() => (token.data as any).parsed[2]).chain((folder) =>
						Either.fromNullable(findOrdoFolder(t, "readableName", folder)),
					),
				)
				.fold(id, (c) => setContent(c));
		}, [tree.path, token.raw]);

		return Either.fromNullable(content).fold(NoOp, (t) => (
			<div className="rounded-xl bg-neutral-50 shadow-lg mb-4">
				<Graph tree={t} height={"50vh"} />
			</div>
		));
	},
	() => true,
);
