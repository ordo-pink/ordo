import type { Change, ChangeKeys } from "./types";

import { pipe } from "ramda";
import { Switch } from "or-else";
import { promises } from "fs";

import { EditorAction, EditorAPI } from "./editor-renderer-api";
import { KeyboardShortcuts } from "../keybindings/keyboard-shortcuts";
import { KeybindableAction } from "../keybindings/keybindable-action";
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

const createKeybinding = (keys: ChangeKeys): string => {
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

const getKeybindableAction = (keybinding: string): (() => void) => {
	const keyBindable = Object.keys(KeyboardShortcuts).find(
		(key) => KeyboardShortcuts[key as unknown as KeybindableAction].accelerator === keybinding,
	);

	return keyBindable ? KeyboardShortcuts[keyBindable as unknown as KeybindableAction].action : null;
};

const getKeybinding = pipe(createKeybinding, getKeybindableAction);

export const EditorMainAPI = (state: WindowState): typeof EditorAPI => ({
	[EditorAction.ADD_TAB]: async (path: string) => {
		const file = getFile(state.explorer.tree, path);

		return promises.readFile(file.path).then((f) => {
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

			return state;
		});
	},
	[EditorAction.ON_KEYDOWN]: async (change: Change) => {
		const tab = state.editor.tabs[state.editor.currentTab];
		// const body = tab.body;

		// KeyboardShortcuts[KeybindableAction.SELECT_ALL].action = () => {
		// 	change.selection.start.index = 0;
		// 	change.selection.start.line = 0;
		// 	change.selection.end.index = body[body.length - 1].length;
		// 	change.selection.end.line = body.length - 1;
		// 	change.selection.direction = "ltr";
		// };

		const runKeyBinding = getKeybinding(change.keys);

		if (runKeyBinding) {
			runKeyBinding();

			return state;
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

		return state;
	},
	[EditorAction.OPEN_TAB]: async (index: number) => {
		if (index >= state.editor.tabs.length) {
			// TODO: Add error warning
			return state;
		}

		state.editor.currentTab = index;
		state.explorer.selection = state.editor.tabs[index].path;

		return state;
	},
	[EditorAction.CLOSE_TAB]: async (index: number) => {
		if (index >= state.editor.tabs.length) {
			// TODO: Add error warning
			return state;
		}

		state.editor.tabs.splice(index, 1);

		if (state.editor.currentTab === index) {
			if (state.editor.currentTab > 0) {
				state.editor.currentTab--;
			} else if (state.editor.tabs.length > 0) {
				state.editor.currentTab++;
			} else {
				state.editor.currentTab = 0;
			}
		}

		state.explorer.selection = state.editor.tabs[state.editor.currentTab].path;

		return state;
	},
});
