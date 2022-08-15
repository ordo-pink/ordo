import React, { useState, useEffect } from "react";
import { Network, Options } from "vis-network";

import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";
import { useAppDispatch } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { Loader } from "@modules/graph/components/loader";

const collectNodes = (
	tree: OrdoFolder,
	nodes: any[] = [],
	edges: any[] = [],
	showTags: boolean,
	showLinks: boolean,
	showFolders: boolean,
	isDarkMode = false,
) => {
	if (showFolders) {
		nodes.push({
			...tree,
			label: tree.readableName,
			id: tree.path,
			height: tree.depth,
			color: isDarkMode ? "#86C6FD" : "#bde0fe",
			size: tree.children.length + 10,
		});
	}

	tree.children.forEach((child) => {
		if (isFolder(child)) {
			collectNodes(child, nodes, edges, showTags, showLinks, showFolders, isDarkMode);
		} else {
			nodes.push({
				...child,
				label: child.readableName,
				id: child.path,
				color: isDarkMode ? "#FF99C0" : "#ffc8dd",
				size: 10,
				height: tree.depth,
			});

			if (child.frontmatter) {
				if (showTags && child.frontmatter.tags) {
					child.frontmatter.tags.forEach((tag: string) => {
						if (!nodes.some((node) => node.id === tag)) {
							nodes.push({
								label: `#${tag}`,
								id: tag,
								color: isDarkMode ? "#B591CA" : "#cdb4db",
								size: 15,
								height: 0,
							});
						}

						edges.push({
							width: 1,
							color: isDarkMode ? "#B591CA" : "#cdb4db",
							from: child.path,
							to: tag,
							length: 150,
						});
					});
				}

				if (showLinks && child.frontmatter.embeds) {
					child.frontmatter.embeds.forEach((embed: string) => {
						edges.push({
							width: 2,
							color: isDarkMode ? "#FF70A5" : "#ffafcc",
							from: child.path,
							to: embed,
							length: 50,
						});
					});
				}

				if (showLinks && child.frontmatter.links) {
					child.frontmatter.links.forEach((embed: string) => {
						edges.push({
							width: 2,
							dashes: true,
							arrows: "to",
							color: isDarkMode ? "#FF70A5" : "#ffafcc",
							from: child.path,
							to: embed,
							length: 100,
						});
					});
				}
			}
		}

		if (showFolders && !edges.some((l) => l.source === tree.path && l.target === child.path)) {
			edges.push({
				arrows: "to",
				color: isFolder(child) ? (isDarkMode ? "#70BAFF" : "#a2d2ff") : isDarkMode ? "#FF70A5" : "#ffafcc",
				from: tree.path,
				to: child.path,
				length: 300,
			});
		}
	});

	return { nodes, edges };
};

const createNetwork = (
	tree: OrdoFolder,
	showTags: boolean,
	showLinks: boolean,
	showFolders: boolean,
	isDarkMode = false,
) => {
	const { nodes, edges } = collectNodes(tree, [], [], showTags, showLinks, showFolders, isDarkMode);

	edges.forEach((edge) => {
		if (!nodes.some((node) => node.id === edge.to)) {
			const file = findOrdoFile(tree, "readableName", edge.to);

			if (!file) {
				nodes.push(
					edge.color === "#ffafcc" || edge.color === "#FF70A5"
						? {
								label: edge.to,
								id: edge.to,
								color: isDarkMode ? "#FF99C0" : "#ffc8dd",
								size: 15,
								height: 0,
						  }
						: {
								label: edge.to,
								id: edge.to,
								color: isDarkMode ? "#86C6FD" : "#bde0fe",
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
	showTags?: boolean;
	showFolders?: boolean;
	showLinks?: boolean;
};

export const Graph: React.FC<GraphProps> = React.memo(
	({ tree, height = "98vh", showTags = true, showFolders = true, showLinks = true }) => {
		const mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		const data = createNetwork(tree, showTags, showLinks, showFolders, mode === "dark");
		const ref = React.useRef<HTMLDivElement>(null);
		const dispatch = useAppDispatch();
		const [loader, setLoader] = useState(true);

		useEffect(() => {
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
						color: mode === "dark" ? "#ddd" : "#111",
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
				layout: {
					improvedLayout: false,
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

			network.on("beforeDrawing", () => {
				setLoader(false);
			});
		}, [ref, tree]);

		return (
			<>
				{loader && (
					<div className="absolute top-1/2 left-1/2">
						<Loader />
					</div>
				)}
				<div onClick={(e) => e.stopPropagation()} className="cursor-auto" style={{ height }} ref={ref}></div>
			</>
		);
	},
	() => true,
);
