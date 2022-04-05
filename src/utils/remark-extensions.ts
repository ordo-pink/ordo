import { visit, Node, Parent } from "unist-util-visit";

import { OrdoFolder } from "@modules/editor/editor-slice";
import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";
import { isImageUrl } from "./is-image-url";

export const wikiLinkEmbeds =
	(options: { fileTree?: OrdoFolder } = {}) =>
	(tree: Node) => {
		visit(tree, (node: any) => {
			if (node.type === "text" && node.value.startsWith("![[") && node.value.endsWith("]]")) {
				node.type = "wikiLinkEmbed";

				const path = node.value.slice(3, -2);
				const external = path.startsWith("http");
				const type = isImageUrl(path) ? "image" : external ? "link" : "document";
				let exists: boolean | undefined = undefined;

				if (options.fileTree && !external) {
					exists = Boolean(findOrdoFile(options.fileTree, path));
				}

				node.data = {
					path,
					external,
					exists,
					type,
				};
			}
		});
	};

const attachId = (node: Node, id: number | null, parentId: string | number | null = null) => {
	(node as any).id = parentId ? `${parentId}-${id}` : String(id);

	if ((node as any).children && node.type !== "root") {
		(node as any).children.forEach((child: any, i: number) => {
			attachId(child, i, (node as any).id);
		});
	}
};

export const attachIds = () => (tree: Node) => {
	visit(tree, (node, index) => {
		if ((node as any).id == null && node.type !== "root") {
			attachId(node, index);
		}
	});
};

export const extractFrontmatter = () => (tree: Parent) => {
	if (tree.children[0].type === "yaml") {
		(tree as any).frontmatter = tree.children[0];
		tree.children.splice(0, 1);
	}
};

export const groupByLines = () => (tree: Parent) => {
	let currentLine = 0;

	(tree as any).children = (tree as any).children.reduce((acc: any, child: any) => {
		if (child.position.start.line === currentLine) {
			return acc;
		}

		while (child.position.start.line - currentLine > 1) {
			const newLine = {
				number: currentLine + 1,
				children: [] as any[],
				width: 0,
			};

			acc.push(newLine);

			currentLine++;
		}

		child.number = child.position.start.line;
		child.width = child.position.end.column - 1;

		acc.push(child);

		currentLine = child.position.start.line;

		if (child.children && child.type !== "list") {
			child.children.forEach((grandChild: any) => {
				if (grandChild.position.start.line !== child.position.start.line) {
					child.children.splice(child.children.indexOf(grandChild), 1);

					acc.push({
						number: grandChild.position.start.line,
						width: grandChild.position.end.column - 1,
						children: [grandChild],
					});

					currentLine++;
				}
			});
		}

		return acc;
	}, [] as any[]);
};
