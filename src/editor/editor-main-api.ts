import type { Change, ChangeKeys, ChangeResponse } from "./types";

import { IpcMain } from "electron";
import { tap } from "or-pipets";
import { identity, pipe } from "ramda";
import { Switch } from "or-else";

import { EditorAction } from "./editor-renderer-api";
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

const content = ["# Test\n", "\n", "Hello there\n"];

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

export const registerEditorMainAPIs = pipe(
	tap((ipcMain: IpcMain) => ipcMain.handle(EditorAction.GET_CONTENT, () => content)),
	tap((ipcMain: IpcMain) =>
		ipcMain.handle(EditorAction.ON_KEY_DOWN, (_, change: Change): ChangeResponse => {
			KeyboardShortcuts[KeybindableAction.SELECT_ALL].action = () => {
				change.selection.start.index = 0;
				change.selection.start.line = 0;
				change.selection.end.index = content[content.length - 1].length;
				change.selection.end.line = content.length - 1;
				change.selection.direction = "ltr";
			};

			const runKeyBinding = getKeybinding(change.keys);

			if (runKeyBinding) {
				runKeyBinding();

				return {
					...change,
					content,
				};
			}

			const handle = Switch.of(change.keys.key)
				.case("Dead", identity)
				.case("ArrowUp", handleArrowUp)
				.case("ArrowDown", handleArrowDown)
				.case("ArrowLeft", handleArrowLeft)
				.case("ArrowRight", handleArrowRight)
				.case("Enter", handleEnter)
				.case("Backspace", handleBackspace)
				.case("Tab", handleTab)
				.default(handleTyping);

			return handle({ ...change, content });
		}),
	),
);
