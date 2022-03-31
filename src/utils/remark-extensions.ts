import { OrdoFolder } from "@modules/editor/editor-slice";
import { visit, Node, Parent } from "unist-util-visit";
import { isImageUrl } from "./is-image-url";
import { findOrdoFile } from "./tree/find-ordo-file";

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

		return acc;
	}, [] as any[]);
};
