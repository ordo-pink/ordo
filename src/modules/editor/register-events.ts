import { sep } from "path";

import { registerEvents } from "@core/transmission/register-ordo-events";
import { readFile } from "@modules/file-explorer/api/read-file";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { EditorEvents } from "@modules/editor/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";
import { parse } from "@modules/md-parser/parse";

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

			draft.editor.tabs.push({
				raw,
				path: payload,
				lines: raw.split("\n").map((line) => line.concat(" ")),
				caretPositions: [
					{
						start: { line: 0, character: 0 },
						end: { line: 0, character: 0 },
						direction: "ltr",
					},
				],
				content: parse(raw),
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

		if (currentTabIndex === -1 && tabIndex === -1) {
			return;
		}

		draft.editor.tabs.splice(tabIndex !== -1 ? tabIndex : currentTabIndex, 1);
		draft.editor.currentTab = draft.editor.tabs.length > 0 ? draft.editor.tabs[0].path : "";

		const file = findOrdoFile(tree, "path", draft.editor.currentTab);

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

		const currentLine = tab.lines[tab.caretPositions[0].start.line];

		if (
			payload.event.key === "Shift" ||
			payload.event.key === "Alt" ||
			payload.event.key === "Control" ||
			payload.event.key === "Escape" ||
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
		} else if (payload.event.key === "ArrowRight") {
			if (tab.caretPositions[0].start.character === currentLine.length - 1) {
				if (tab.caretPositions[0].start.line === tab.lines.length - 1) {
					return;
				}

				tab.caretPositions[0].start.line++;
				tab.caretPositions[0].start.character = 0;
			} else {
				tab.caretPositions[0].start.character++;
			}
		} else if (payload.event.key === "ArrowLeft") {
			if (tab.caretPositions[0].start.character === 0) {
				if (tab.caretPositions[0].start.line === 0) {
					return;
				}

				tab.caretPositions[0].start.line--;
				tab.caretPositions[0].start.character = tab.lines[tab.caretPositions[0].start.line].length - 1;
			} else {
				tab.caretPositions[0].start.character--;
			}
		} else if (payload.event.key === "ArrowUp") {
			if (tab.caretPositions[0].start.line === 0) {
				return;
			}

			tab.caretPositions[0].start.line--;

			if (tab.lines[tab.caretPositions[0].start.line].length <= tab.caretPositions[0].start.character) {
				tab.caretPositions[0].start.character = tab.lines[tab.caretPositions[0].start.line].length - 1;
			}
		} else if (payload.event.key === "ArrowDown") {
			if (tab.caretPositions[0].start.line === tab.lines.length - 1) {
				return;
			}

			tab.caretPositions[0].start.line++;

			if (tab.lines[tab.caretPositions[0].start.line].length <= tab.caretPositions[0].start.character) {
				tab.caretPositions[0].start.character = tab.lines[tab.caretPositions[0].start.line].length - 1;
			}
		} else if (payload.event.key === "Delete") {
			tab.lines[tab.caretPositions[0].start.line] =
				tab.lines[tab.caretPositions[0].start.line].slice(0, tab.caretPositions[0].start.character) +
				tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character + 1);
		} else if (payload.event.key === "Backspace") {
			if (tab.caretPositions[0].start.character === 0) {
				if (tab.caretPositions[0].start.line === 0) {
					return;
				}

				tab.caretPositions[0].start.character = tab.lines[tab.caretPositions[0].start.line - 1].length - 1;
				tab.lines[tab.caretPositions[0].start.line - 1] =
					tab.lines[tab.caretPositions[0].start.line - 1].slice(0, -1) + currentLine;
				tab.lines.splice(tab.caretPositions[0].start.line, 1);
				tab.caretPositions[0].start.line--;
			} else {
				tab.lines[tab.caretPositions[0].start.line] =
					tab.lines[tab.caretPositions[0].start.line].slice(0, tab.caretPositions[0].start.character - 1) +
					tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character);
				tab.caretPositions[0].start.character--;
			}
		} else if (payload.event.key === "Enter") {
			let lineContent = " ";

			lineContent = tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character);

			tab.lines[tab.caretPositions[0].start.line] =
				tab.lines[tab.caretPositions[0].start.line].slice(
					0,
					tab.caretPositions[0].start.character ? tab.caretPositions[0].start.character : 0,
				) + " ";

			tab.lines.splice(tab.caretPositions[0].start.line + 1, 0, lineContent);

			tab.caretPositions[0].start.line++;
			tab.caretPositions[0].start.character = 0;
		} else {
			if (payload.event.ctrlKey || payload.event.altKey || payload.event.metaKey) {
				return;
			}

			const newLine =
				currentLine.slice(0, tab.caretPositions[0].start.character) +
				(payload.event.shiftKey ? payload.event.key.toUpperCase() : payload.event.key) +
				currentLine.slice(tab.caretPositions[0].start.character);

			tab.lines[tab.caretPositions[0].start.line] = newLine;
			tab.caretPositions[0].start.character++;
			tab.caretPositions[0].end.character = tab.caretPositions[0].start.character;
		}

		file.size = new TextEncoder().encode(tab.lines.map((line) => line.slice(0, -1)).join("\n")).length;

		transmission.emit("@file-explorer/save-file", { path: tab.path, content: [...tab.lines] });
	},
});
