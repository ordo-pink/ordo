import type { Change, ChangeKeys } from "./types";

import { Switch } from "or-else";
import { promises } from "fs";

import { EditorAction, EditorAPI } from "./editor-renderer-api";
import { handleEnter } from "./key-handlers/enter";
import { handleTab } from "./key-handlers/tab";
import { handleTyping } from "./key-handlers/letters";
import { handleArrowUp } from "./key-handlers/arrow-up";
import { handleArrowLeft } from "./key-handlers/arrow-left";
import { handleArrowRight } from "./key-handlers/arrow-right";
import { handleArrowDown } from "./key-handlers/arrow-down";
import { handleBackspace } from "./key-handlers/backspace";
import { EditorOrdoFile, WindowState } from "../common/types";
import { getFile } from "../explorer/folder/get-file";
import { KeybindableAction } from "../keybindings/keybindable-action";
import { dialog } from "electron";
import { ExplorerMainAPI } from "../explorer/explorer-main-api";
import { ExplorerAction } from "../explorer/explorer-renderer-api";

const createAccelerator = (keys: ChangeKeys): string => {
	let combo = "";

	if (keys.ctrlKey || keys.metaKey) {
		combo += "CommandOrControl+";
	}

	if (keys.altKey) {
		combo += "Alt+";
	}

	if (keys.shiftKey) {
		combo += "Shift+";
	}

	combo += keys.key.toUpperCase();

	return combo;
};

const getKeybindableAction = (keys: ChangeKeys, state: WindowState) => {
	const accelerator = createAccelerator(keys);

	const keyBindable = Object.keys(state.keybindings).find(
		(key) => state.keybindings[key as unknown as KeybindableAction].accelerator === accelerator,
	);

	return keyBindable ? state.keybindings[keyBindable as unknown as KeybindableAction].action : null;
};

export const EditorMainAPI = (state: WindowState): typeof EditorAPI => ({
	[EditorAction.ADD_TAB]: async (path: string) => {
		const tabIndex = state.editor.tabs.findIndex((tab) => tab.path === path);

		if (~tabIndex) {
			state.editor.currentTab = tabIndex;

			EditorMainAPI(state)[EditorAction.OPEN_TAB](tabIndex);

			return;
		}

		const file = getFile(state.explorer.tree, path);

		promises.readFile(file.path).then((f) => {
			if (file.type === "image") {
				state.editor.tabs.push({
					...file,
					body: [`data:image/${file.extension.slice(1)};base64,${f.toString("base64")}`],
					selection: null,
				});
			} else {
				let body: string | string[] = f.toString("utf-8");

				if (!body) {
					body = "\n";
				}

				body = body.split("\n").map((t) => t.concat("\n"));

				state.editor.tabs.push({
					...file,
					body,
					selection: {
						start: { line: 0, index: 0 },
						end: { line: 0, index: 0 },
						direction: "ltr",
					},
				});
			}

			state.editor.currentTab = state.editor.tabs.length - 1;
			state.explorer.selection = state.editor.tabs[state.editor.currentTab].path;

			state.window.setRepresentedFilename(state.editor.tabs[state.editor.currentTab].path);
			state.window.setTitle(
				`${state.editor.tabs[state.editor.currentTab].relativePath} - ${state.explorer.tree.readableName}`,
			);
			state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
		});
	},
	[EditorAction.ON_KEYDOWN]: async (change: Change) => {
		const tab = state.editor.tabs[state.editor.currentTab];

		tab.selection = change.selection;

		if (!change.keys) {
			state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
			return;
		}

		const shortcut = getKeybindableAction(change.keys, state);

		if (shortcut) {
			shortcut(state);
			return;
		}

		const handle = Switch.of(change.keys.key)
			.case("Dead", (tab: EditorOrdoFile) => tab)
			.case("ArrowUp", handleArrowUp)
			.case("ArrowDown", handleArrowDown)
			.case("ArrowLeft", handleArrowLeft)
			.case("ArrowRight", handleArrowRight)
			.case("Enter", handleEnter)
			.case("Backspace", handleBackspace)
			.case("Tab", handleTab)
			.default(handleTyping);

		state.editor.tabs[state.editor.currentTab] = handle(tab, change.keys);

		state.window.setDocumentEdited(true);
		state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
	},
	[EditorAction.OPEN_TAB]: async (index: number) => {
		if (index >= state.editor.tabs.length) {
			// TODO: Add error warning
			return;
		}

		state.editor.currentTab = index;
		state.explorer.selection = state.editor.tabs[index].path;

		state.window.setRepresentedFilename(state.editor.tabs[state.editor.currentTab].path);
		state.window.setTitle(
			`${state.editor.tabs[state.editor.currentTab].relativePath} - ${state.explorer.tree.readableName}`,
		);

		state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
	},
	[EditorAction.CLOSE_TAB]: async (index: number) => {
		if (index >= state.editor.tabs.length) {
			// TODO: Add error warning
			return;
		}

		if (state.window.documentEdited) {
			const result = dialog.showMessageBoxSync(state.window, {
				type: "question",
				buttons: ["Yes", "No"],
				message: "Do you want to save the file before closing?",
			});

			if (result === 0) {
				await ExplorerMainAPI(state)[ExplorerAction.SAVE_FILE]();
			}
		}

		state.editor.tabs.splice(index, 1);

		if (state.editor.currentTab === index) {
			if (state.editor.currentTab > 0) {
				state.editor.currentTab--;
			} else {
				state.editor.currentTab = 0;
			}
		} else if (state.editor.currentTab > index) {
			state.editor.currentTab--;
		}

		state.window.setDocumentEdited(false);
		EditorMainAPI(state)[EditorAction.OPEN_TAB](state.editor.currentTab);

		const newSelection = state.editor.tabs[state.editor.currentTab];

		if (newSelection) {
			state.explorer.selection = newSelection.path;
			state.window.setRepresentedFilename(newSelection.path);
			state.window.setTitle(
				`${state.editor.tabs[state.editor.currentTab].relativePath} - ${state.explorer.tree.readableName}`,
			);
		} else {
			state.explorer.selection = state.explorer.tree.path;
			state.window.setRepresentedFilename(state.explorer.tree.path);
			state.window.setTitle(`${state.explorer.tree.readableName}`);
		}

		state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
	},
});
