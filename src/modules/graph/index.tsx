import React from "react";
import { Network, Options } from "vis-network";

import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

const createNetwork = (tree: OrdoFolder, nodes: any[] = [], edges: any[] = []) => {
	nodes.push({
		...tree,
		label: tree.readableName,
		id: tree.path,
		height: tree.depth,
		color: "#999",
		size: tree.children.length + 10,
	});

	tree.children.forEach((child) => {
		if (isFolder(child)) {
			createNetwork(child, nodes, edges);
		} else {
			nodes.push({
				...child,
				label: child.readableName,
				id: child.path,
				color: "#bbb",
				size: 10,
				height: tree.depth,
			});
		}

		if (!edges.some((l) => l.source === tree.path && l.target === child.path)) {
			edges.push({
				arrows: "to",
				physics: true,
				color: isFolder(child) ? "#aaa" : "#ccc",
				from: tree.path,
				to: child.path,
				length: isFolder(child) ? 250 : 150,
			});
		}
	});

	return { nodes, edges };
};

type GraphProps = {
	tree: OrdoFolder;
	height?: string;
};

export const Graph: React.FC<GraphProps> = React.memo(
	({ tree, height = "98vh" }) => {
		const data = createNetwork(tree, [], []);
		const ref = React.useRef<HTMLDivElement>(null);
		const dispatch = useAppDispatch();

		const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

		React.useEffect(() => {
			if (!ref.current) return;
			var options: Options = {
				manipulation: {
					enabled: false,
				},
				nodes: {
					shape: "dot",
					scaling: {
						min: 10,
						max: 30,
					},
					font: {
						size: 10,
						color: isDarkMode === "dark" ? "#ddd" : "#111",
					},
				},
				edges: {
					color: { inherit: true },
					width: 0.15,
					smooth: {
						enabled: true,
						type: "continuous",
						roundness: 0,
					},
				},
				interaction: {
					hideEdgesOnDrag: false,
					tooltipDelay: 200,
				},

				physics: true,
			};

			const network = new Network(ref.current, data, options);

			network.disableEditMode();

			network.on("click", (properties) => {
				if (properties.nodes.length) {
					const clickedNode = properties.nodes[0];
					const file = findOrdoFile(tree, "path", clickedNode);

					if (file) {
						dispatch({ type: "@editor/open-tab", payload: file.path });
					}
				}
			});
		}, [ref.current, tree, data]);

		return <div onClick={(e) => e.stopPropagation()} className="cursor-auto" style={{ height }} ref={ref}></div>;
	},
	() => true,
);
