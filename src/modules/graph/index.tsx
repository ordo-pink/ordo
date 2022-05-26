import React from "react";
import { Network } from "vis-network";

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
		// color: tree.depth === 0 ? "black" : tree.color === "neutral" ? "#bebebe" : tree.color,
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

export type GraphProps = {
	tree: OrdoFolder;
};

export const Graph: React.FC<GraphProps> = ({ tree }) => {
	const data = createNetwork(tree, [], []);
	const ref = React.useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

	React.useEffect(() => {
		if (!ref.current) return;
		var options: any = {
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
					type: "continuous",
					roundness: 0,
				},
			},
			interaction: {
				hideEdgesOnDrag: false,
				tooltipDelay: 200,
			},
			configure: {
				filter: function (option: any, path: any) {
					if (option === "inherit") {
						return true;
					}
					if (option === "type" && path.indexOf("smooth") !== -1) {
						return true;
					}
					if (option === "roundness") {
						return true;
					}
					if (option === "hideEdgesOnDrag") {
						return true;
					}
					if (option === "hideNodesOnDrag") {
						return true;
					}
					return false;
				},
				container: ref.current,
				showButton: false,
			},
			physics: true,
		};

		const network = new Network(ref.current, data, options);
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

	return <div className="h-[100vh]" ref={ref}></div>;
};
