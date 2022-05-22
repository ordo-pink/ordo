import { sep } from "path";

import { registerEvents } from "@core/transmission/register-ordo-events";
import { readFile } from "@modules/file-explorer/api/read-file";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { EditorEvents } from "@modules/editor/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";
import { createLineNode, parseLine, parseLineContent, parseText, reparseLine } from "@modules/text-parser";
import { createRoot } from "@core/parser/create-root";
import { tail } from "@utils/array";
import { Char, NodeWithChildren } from "@core/parser/types";
import { BlockNodeType } from "@modules/text-parser/enums";

export default registerEvents<EditorEvents>({
	"@editor/open-tab": async ({ draft, payload, transmission, context }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);
		const tree = transmission.select((state) => state.fileExplorer.tree);

		if (currentTab === payload) {
			return;
		}

		const tab = transmission.select((state) => state.editor.tabs.find((tab) => tab.path === payload));

		if (!tab) {
			const raw = await readFile(payload);

			const content = createRoot(payload);

			parseText(raw, content);

			draft.editor.tabs.push({
				raw,
				path: payload,
				caretPositions: [
					{
						start: { line: 1, character: 0 },
						end: { line: 1, character: 0 },
						direction: "ltr",
					},
				],
				content,
			});
		}

		draft.editor.currentTab = payload;
		transmission.emit("@activity-bar/open-editor", null);

		const file = findOrdoFile(tree, "path", draft.editor.currentTab);

		let parentPath = file?.path.split(sep).slice(0, -1).join(sep);

		while (parentPath && parentPath !== tree.path) {
			const folder = findOrdoFolder(tree, parentPath);

			if (folder?.collapsed) {
				await transmission.emit("@file-explorer/toggle-folder", parentPath);
			}

			parentPath = parentPath.split(sep).slice(0, -1).join(sep);
		}

		context.window.setRepresentedFilename(file ? file.path : "");
		context.window.setTitle(file ? `${file.relativePath} — ${tree.readableName}` : "Ordo");

		draft.editor.focused = true;
	},
	"@editor/close-tab": ({ draft, payload, transmission, context }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);
		const tabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === payload));
		const currentTabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === currentTab));
		const tree = transmission.select((state) => state.fileExplorer.tree);
		const file = findOrdoFile(tree, "path", currentTab);

		if (!file || (currentTabIndex === -1 && tabIndex === -1)) {
			return;
		}

		const result = context.dialog.showMessageBoxSync(context.window, {
			type: "question",
			buttons: ["Yes", "No"],
			message: `The file "${file.readableName}" has unsaved changes. Quit without saving?`,
		});

		if (result !== 0) {
			return;
		}

		draft.editor.tabs.splice(tabIndex !== -1 ? tabIndex : currentTabIndex, 1);
		draft.editor.currentTab = draft.editor.tabs.length > 0 ? draft.editor.tabs[0].path : "";

		context.window.setRepresentedFilename(file ? file.path : "");
		context.window.setTitle(file ? `${file.relativePath} — ${tree.readableName}` : "Ordo");
		draft.editor.focused = false;
	},
	"@editor/update-caret-positions": ({ draft, payload }) => {
		const tab = draft.editor.tabs.find((t) => t.path === payload.path);

		if (!tab) {
			return;
		}

		tab.caretPositions = payload.positions;
		if (!draft.editor.focused) {
			draft.editor.focused = true;
		}
	},
	"@editor/focus": ({ draft }) => {
		draft.editor.focused = true;
	},
	"@editor/unfocus": ({ draft }) => {
		draft.editor.focused = false;
	},
	"@editor/handle-typing": ({ draft, payload, transmission }) => {
		if (!draft.editor.focused) {
			return;
		}

		const tab = draft.editor.tabs.find((t) => t.path === payload.path);
		const file = findOrdoFile(draft.fileExplorer.tree, "path", payload.path);

		if (!tab || !file) return;

		const currentLine = tab.content.children.find((node) => node.range.start.line === tab.caretPositions[0].start.line);

		if (!currentLine) return;

		if (
			payload.event.key === "Shift" ||
			payload.event.key === "Alt" ||
			payload.event.key === "Control" ||
			payload.event.key === "Insert" ||
			payload.event.key === "Meta" ||
			payload.event.key === "F1" ||
			payload.event.key === "F2" ||
			payload.event.key === "F3" ||
			payload.event.key === "F4" ||
			payload.event.key === "F5" ||
			payload.event.key === "F6" ||
			payload.event.key === "F7" ||
			payload.event.key === "F8" ||
			payload.event.key === "F9" ||
			payload.event.key === "F10" ||
			payload.event.key === "F11" ||
			payload.event.key === "F12" ||
			payload.event.key === "AltGraph" ||
			payload.event.key === "Tab" ||
			payload.event.key === "CapsLock" ||
			payload.event.key === "NumLock" ||
			payload.event.key === "PrintScreen" ||
			payload.event.key === "Pause"
		) {
			return;
		} else if (payload.event.key === "Escape") {
			if (tab.caretPositions.length > 1) {
				tab.caretPositions = [tail(tab.caretPositions)];
			}
		} else if (payload.event.key === "ArrowRight") {
			tab.caretPositions.forEach((position) => {
				if (position.start.character === currentLine.range.end.character) {
					if (position.start.line === tail(tab.content.children).range.start.line) {
						position.start.character = tail(tab.content.children).range.end.character;
						return;
					}
					position.start.line++;
					position.start.character = 0;
				} else {
					position.start.character++;
				}
			});
		} else if (payload.event.key === "ArrowLeft") {
			tab.caretPositions.forEach((position) => {
				if (position.start.character === 0) {
					if (position.start.line === 1) {
						return;
					}
					position.start.line--;
					position.start.character = tab.content.children[position.start.line - 1].range.end.character;
				} else {
					position.start.character--;
				}
			});
		} else if (payload.event.key === "ArrowUp") {
			tab.caretPositions.forEach((position) => {
				if (position.start.line === 1) {
					position.start.character = 0;
					return;
				}
				position.start.line--;
				if (tab.content.children[position.start.line - 1].range.end.character <= position.start.character) {
					position.start.character = tab.content.children[position.start.line - 1].range.end.character;
				}
			});
		} else if (payload.event.key === "ArrowDown") {
			tab.caretPositions.forEach((position) => {
				if (position.start.line === tail(tab.content.children).range.end.line) {
					position.start.character = tail(tab.content.children).range.end.character;
					return;
				}
				position.start.line++;
				if (tab.content.children[position.start.line - 1].range.end.character <= position.start.character) {
					position.start.character = tab.content.children[position.start.line - 1].range.end.character;
				}
			});
		} else if (payload.event.key === "Delete") {
			let reparse = false;

			tab.caretPositions.forEach((position) => {
				const lineIndex = position.start.line - 1;
				const charPosition = position.start.character;
				const line = tab.content.children[lineIndex] as NodeWithChildren;

				if (charPosition === tab.content.children[lineIndex].raw.length) {
					if (lineIndex === tab.content.children.length - 1) {
						return;
					}

					tab.content.children[lineIndex].raw =
						tab.content.children[lineIndex].raw + tab.content.children[lineIndex + 1].raw;

					tab.content.children.splice(lineIndex + 1, 1);

					reparse = true;
				} else {
					tab.content.children[lineIndex].raw = line.raw.slice(0, charPosition).concat(line.raw.slice(charPosition + 1));

					tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
						depth: tab.content.depth,
					});
				}
			});

			if (reparse) {
				tab.content.children.forEach((line, index) => {
					tab.content.children[index] = parseLine(line.raw, index, tab.content, {
						depth: tab.content.depth,
					});
				});
			}

			tab.unsaved = true;
		} else if (payload.event.key === "Backspace") {
			let reparse = false;

			tab.caretPositions.forEach((position) => {
				const lineIndex = position.start.line - 1;
				const charPosition = position.start.character;

				if (charPosition === 0) {
					if (lineIndex === 0) {
						return;
					}

					position.start.line--;
					position.start.character = tab.content.children[lineIndex - 1].raw.length;

					tab.content.children[lineIndex - 1].raw =
						tab.content.children[lineIndex - 1].raw + tab.content.children[lineIndex].raw;

					tab.content.children.splice(lineIndex, 1);

					reparse = true;
				} else {
					tab.content.children[lineIndex].raw =
						tab.content.children[lineIndex].raw.slice(0, charPosition - 1) +
						tab.content.children[lineIndex].raw.slice(charPosition);
					position.start.character--;

					tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
						depth: tab.content.depth,
					});
				}
			});

			if (reparse) {
				tab.content.children.forEach((line, index) => {
					tab.content.children[index] = parseLine(line.raw, index, tab.content, {
						depth: tab.content.depth,
					});
				});
			}

			tab.unsaved = true;
		} else if (payload.event.key === "Enter") {
			// TODO: Fix backspace and enter with multiple carets
			tab.caretPositions.forEach((position) => {
				const lineIndex = position.start.line - 1;
				const raw = tab.content.children[lineIndex].raw.slice(position.start.character);

				tab.content.children[lineIndex].raw = tab.content.children[lineIndex].raw.slice(0, position.start.character);

				position.start.line = position.start.line + 1;
				position.start.character = 0;

				const node = createLineNode(
					BlockNodeType.LINE,
					tab.content,
					{ position: { character: 1, line: lineIndex + 1 } } as Char,
					tab.content.depth + 1,
				);
				node.raw = raw;

				tab.content.children.splice(lineIndex + 1, 0, node);
			});

			tab.content.children.forEach((line, index) => {
				tab.content.children[index] = parseLine(line.raw, index, tab.content, {
					depth: tab.content.depth,
				});
			});

			tab.unsaved = true;
		} else {
			if (payload.event.ctrlKey || payload.event.altKey || payload.event.metaKey) {
				return;
			}

			tab.caretPositions.forEach((position) => {
				const lineIndex = position.start.line - 1;
				const charPosition = position.start.character;

				const newLine =
					tab.content.children[lineIndex].raw.slice(0, charPosition) +
					(payload.event.shiftKey ? payload.event.key.toUpperCase() : payload.event.key) +
					tab.content.children[lineIndex].raw.slice(charPosition);
				tab.content.children[lineIndex].raw = newLine;

				tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
					depth: tab.content.depth,
				});

				position.start.character++;
				position.end.character = position.start.character;
			});

			tab.unsaved = true;
		}

		tab.content.raw = tab.content.children.map((line) => line.raw).join("\n");
		tab.raw = tab.content.raw;
		file.size = new TextEncoder().encode(tab.raw === "\n" ? "" : tab.content.raw).length;

		transmission.emit("@file-explorer/save-file", { path: tab.path, content: tab.content.raw });
	},
});
