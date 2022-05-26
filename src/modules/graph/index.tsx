import React from "react";
import { Network, Options } from "vis-network";

import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";
import { useAppDispatch } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

const collectNodes = (tree: OrdoFolder, nodes: any[] = [], edges: any[] = []) => {
	nodes.push({
		...tree,
		label: tree.readableName,
		id: tree.path,
		height: tree.depth,
		color: "#bde0fe",
		size: tree.children.length + 10,
	});

	tree.children.forEach((child) => {
		if (isFolder(child)) {
			collectNodes(child, nodes, edges);
		} else {
			nodes.push({
				...child,
				label: child.readableName,
				id: child.path,
				color: "#ffc8dd",
				size: 10,
				height: tree.depth,
			});

			if (child.frontmatter) {
				if (child.frontmatter.tags) {
					child.frontmatter.tags.forEach((tag: string) => {
						if (!nodes.some((node) => node.id === tag)) {
							nodes.push({
								label: `#${tag}`,
								id: tag,
								color: "#cdb4db",
								size: 15,
								height: 0,
							});
						}

						edges.push({
							color: "#cdb4db",
							from: child.path,
							to: tag,
							length: 100,
						});
					});
				}

				if (child.frontmatter.embeds) {
					child.frontmatter.embeds.forEach((embed: string) => {
						edges.push({
							arrow: "to",
							color: "#ffafcc",
							from: child.path,
							to: embed,
							length: 500,
						});
					});
				}

				if (child.frontmatter.links) {
					child.frontmatter.links.forEach((embed: string) => {
						edges.push({
							dashes: true,
							arrow: "to",
							color: "#ffafcc",
							from: child.path,
							to: embed,
							length: 500,
						});
					});
				}
			}
		}

		if (!edges.some((l) => l.source === tree.path && l.target === child.path)) {
			edges.push({
				arrows: "to",
				color: isFolder(child) ? "#a2d2ff" : "#ffafcc",
				from: tree.path,
				to: child.path,
				length: isFolder(child) ? 310 : 150,
			});
		}
	});

	return { nodes, edges };
};

const createNetwork = (tree: OrdoFolder) => {
	const { nodes, edges } = collectNodes(tree, [], []);

	edges.forEach((edge) => {
		if (!nodes.some((node) => node.id === edge.to)) {
			const file = findOrdoFile(tree, "readableName", edge.to);

			if (!file) {
				nodes.push(
					edge.color === "#ffafcc"
						? {
								label: edge.to,
								id: edge.to,
								color: "#ffcdb2",
								size: 15,
								height: 0,
						  }
						: {
								label: edge.to,
								id: edge.to,
								color: "#bde0fe",
								size: 15,
								height: 0,
						  },
				);
			} else {
				edge.to = file.path;
			}
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
		const data = createNetwork(tree);
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
						size: 12,
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
