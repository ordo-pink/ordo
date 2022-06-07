import { promises, existsSync } from "fs";

import { OrdoEventHandler } from "@core/types";
import { extractFrontmatter, parseText } from "@modules/text-parser";
import { findOrdoFile } from "../utils/find-ordo-file";
import { createRoot } from "@core/parser/create-root";

// TODO: Rewrite with "@editor/toggle-todo"
export const handleReplaceLine: OrdoEventHandler<"@file-explorer/replace-line"> = async ({
	payload,
	transmission,
	draft,
}) => {
	const tree = draft.fileExplorer.tree;
	const tabs = draft.editor.tabs;

	if (!existsSync(payload.path)) return;

	const fileContent = await promises.readFile(payload.path, "utf8");
	const fileLines = fileContent.split("\n");

	const index = fileLines.findIndex((line) => line === payload.oldContent);

	fileLines[index] = payload.newContent;

	const frontmatter = extractFrontmatter(fileContent).frontmatter;

	if (payload.oldContent.startsWith("[ ] ")) {
		frontmatter!.todos.pending.splice(frontmatter!.todos.pending.indexOf(payload.oldContent.slice(4)), 1);
		frontmatter!.todos.done.push(payload.oldContent.slice(4));
	} else {
		frontmatter!.todos.done.splice(frontmatter!.todos.done.indexOf(payload.oldContent.slice(4)), 1);
		frontmatter!.todos.pending.push(payload.oldContent.slice(4));
	}

	frontmatter!.todos.pending = Array.from(new Set(frontmatter!.todos.pending));
	frontmatter!.todos.done = Array.from(new Set(frontmatter!.todos.done));

	fileLines[1] = JSON.stringify(frontmatter);

	await promises.writeFile(payload.path, fileLines.join("\n"));

	const tab = tabs.find((tab) => tab.path === payload.path);

	if (tab) {
		const file = findOrdoFile(tree, "path", tab.path)!;
		file.frontmatter = frontmatter;

		const content = createRoot(file.path);
		parseText(fileLines.join("\n"), content);

		tab.content = content;

		tab.content.data.frontmatter = frontmatter;
	}

	transmission.emit("@file-explorer/list-folder", tree.path);
};
