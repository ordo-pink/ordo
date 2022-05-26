import React from "react";
import { useAppSelector } from "@core/state/store";
import { Either } from "or-else";
import { Graph } from ".";
import { NoOp } from "@utils/no-op";

export const GraphView: React.FC = () => {
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	return Either.fromNullable(tree).fold(NoOp, (t) => <Graph tree={t} />);
};
